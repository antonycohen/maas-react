import { createProjectGraphAsync, Tree, ProjectGraphProjectNode } from '@nx/devkit';
import { join, relative } from 'path';
import { SyncGeneratorResult } from 'nx/src/utils/sync-generators';

/**
 * Find all apps that have the tailwind-sync-plugin configured in their package.json
 */
function findAppsWithTailwindSync(
  tree: Tree,
  projectGraph: Record<string, ProjectGraphProjectNode>
): string[] {
  const apps: string[] = [];

  for (const [projectName, project] of Object.entries(projectGraph)) {
    if (project.data.projectType !== 'application') continue;

    const packageJsonPath = join(project.data.root, 'package.json');
    if (!tree.exists(packageJsonPath)) continue;

    const packageJson = JSON.parse(tree.read(packageJsonPath)!.toString());
    const nxConfig = packageJson.nx;

    if (!nxConfig?.targets) continue;

    // Check if any target uses the tailwind-sync-plugin
    const usesTailwindSync = Object.values(nxConfig.targets).some(
      (target: unknown) => {
        const t = target as { syncGenerators?: string[] };
        return t.syncGenerators?.some((gen: string) =>
          gen.includes('tailwind-sync-plugin')
        );
      }
    );

    if (usesTailwindSync) {
      apps.push(projectName);
    }
  }

  return apps;
}

/**
 * Get all dependencies for a given app
 */
function getAppDependencies(
  appName: string,
  projectGraph: {
    nodes: Record<string, ProjectGraphProjectNode>;
    dependencies: Record<string, { target: string }[]>;
  }
): Set<string> {
  const dependencies = new Set<string>();
  const queue = [appName];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = projectGraph.dependencies[current] || [];
    deps.forEach((dep) => {
      dependencies.add(dep.target);
      queue.push(dep.target);
    });
  }

  return dependencies;
}

/**
 * Generate @source directives for an app's dependencies
 */
function generateSourceDirectives(
  appRoot: string,
  dependencies: Set<string>,
  projectGraph: Record<string, ProjectGraphProjectNode>
): string[] {
  const sourceDirectives: string[] = [];
  const stylesDir = join(appRoot, 'src');

  dependencies.forEach((dep) => {
    const project = projectGraph[dep];
    if (project && project.data.root) {
      // Calculate relative path from app's src directory to dependency
      const relativePath = relative(stylesDir, project.data.root);
      sourceDirectives.push(`@source "${relativePath}";`);
    }
  });

  return sourceDirectives.sort();
}

/**
 * Update styles.css for a single app
 */
function updateAppStyles(
  tree: Tree,
  appName: string,
  appRoot: string,
  sourceDirectives: string[]
): { updated: boolean; message: string } {
  const stylesPath = join(appRoot, 'src/styles.css');

  if (!tree.exists(stylesPath)) {
    return { updated: false, message: `${appName}: styles.css not found` };
  }

  const currentContent = tree.read(stylesPath)!.toString();

  // Find where to insert the @source directives (after @import "tailwindcss";)
  const importIndex = currentContent.indexOf('@import "tailwindcss";');
  if (importIndex === -1) {
    return {
      updated: false,
      message: `${appName}: Could not find @import "tailwindcss"`,
    };
  }

  // Extract existing @source directives
  const sourceRegex = /@source\s+"[^"]+";/g;
  const existingSourcesMatch = currentContent.match(sourceRegex) || [];
  const existingSources = new Set(existingSourcesMatch.map((s) => s.trim()));

  // Check if we need to update
  const needsUpdate =
    sourceDirectives.length !== existingSources.size ||
    sourceDirectives.some((directive) => !existingSources.has(directive));

  if (!needsUpdate) {
    return { updated: false, message: '' };
  }

  // Remove all existing @source directives
  const cleanedContent = currentContent.replace(/\n@source\s+"[^"]+";/g, '');

  // Find the import line again in cleaned content
  const cleanImportIndex = cleanedContent.indexOf('@import "tailwindcss";');
  const cleanImportEndIndex =
    cleanedContent.indexOf('\n', cleanImportIndex) + 1;

  // Insert new @source directives after the import
  const beforeImport = cleanedContent.substring(0, cleanImportEndIndex);
  const afterImport = cleanedContent.substring(cleanImportEndIndex);

  // Add source directives with proper formatting
  const sourcesBlock =
    sourceDirectives.length > 0
      ? '\n' + sourceDirectives.join('\n') + '\n'
      : '';

  const newContent = beforeImport + sourcesBlock + afterImport;

  tree.write(stylesPath, newContent);

  return {
    updated: true,
    message: `${appName}: Updated with ${sourceDirectives.length} source directives`,
  };
}

export async function updateTailwindGlobsGenerator(
  tree: Tree
): Promise<SyncGeneratorResult> {
  const projectGraph = await createProjectGraphAsync();

  // Find all apps that use tailwind-sync-plugin
  const apps = findAppsWithTailwindSync(tree, projectGraph.nodes);

  if (apps.length === 0) {
    return {
      outOfSyncMessage: 'No apps configured with tailwind-sync-plugin found',
    };
  }

  const results: string[] = [];

  for (const appName of apps) {
    const appProject = projectGraph.nodes[appName];
    if (!appProject) continue;

    const dependencies = getAppDependencies(appName, projectGraph);
    const sourceDirectives = generateSourceDirectives(
      appProject.data.root,
      dependencies,
      projectGraph.nodes
    );

    const result = updateAppStyles(
      tree,
      appName,
      appProject.data.root,
      sourceDirectives
    );

    if (result.updated) {
      results.push(result.message);
    }
  }

  if (results.length > 0) {
    return {
      outOfSyncMessage: `Tailwind @source directives updated:\n${results.join('\n')}`,
    };
  }

  return {};
}

export default updateTailwindGlobsGenerator;
