import { createProjectGraphAsync, Tree } from '@nx/devkit';
import { join } from 'path';
import { SyncGeneratorResult } from 'nx/src/utils/sync-generators';

export async function updateTailwindGlobsGenerator(
  tree: Tree,
): Promise<SyncGeneratorResult> {
  const projectGraph = await createProjectGraphAsync();
  const apps = Object.values(projectGraph.nodes).filter(
    (node) => node.type === 'app',
  );

  // Get all dependencies of the shop app
  const dependencies = new Set<string>();
  const queue = apps.map((app) => app.name);
  const visited = new Set<string>();

  // BFS to find all dependencies
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

  // Generate @source directives for each dependency
  const sourceDirectives: string[] = [];

  // Add patterns for each dependency
  dependencies.forEach((dep) => {
    const project = projectGraph.nodes[dep];
    if (project && project.data.root) {
      const relativePath = join('../../../', project.data.root);
      sourceDirectives.push(`@source "${relativePath}";`);
    }
  });

  // Sort for consistency
  sourceDirectives.sort();

  let updated = 0;
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];

    // Read current styles.css
    const stylesPath = `${app.data.root}/src/styles.css`;
    const currentContent = tree.read(stylesPath)?.toString() || '';

    // Find where to insert the @source directives (after @import "tailwindcss";)
    const importIndex = currentContent.indexOf('@import "tailwindcss";');
    if (importIndex === -1) {
      return {
        outOfSyncMessage: 'Could not find @import "tailwindcss"; in styles.css',
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

    if (needsUpdate) {
      // Remove all existing @source directives
      let cleanedContent = currentContent;

      // Remove @source lines (including newlines)
      cleanedContent = cleanedContent.replace(/\n@source\s+"[^"]+";/g, '');

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

      updated++;
    }
  }

  if (updated) {
    return {
      outOfSyncMessage: `Tailwind @source directives updated. Added ${sourceDirectives.length} source directives.`,
    };
  } else {
    return {};
  }
}

export default updateTailwindGlobsGenerator;
