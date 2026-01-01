import { useOutletContext } from 'react-router-dom';
import { EditUserOutletContext } from '../../types';
import { FormProvider } from 'react-hook-form';
import { Button } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { UpdateUserInfo } from '@maas/core-api-models';
import { useAccountProfileForm } from './hooks/use-account-profile-form';

export const AccountProfileTab = () => {
  const { user, isLoading } = useOutletContext<EditUserOutletContext>();

  const { form, handleSubmit, isUpdating } =
    useAccountProfileForm(user);

  const { ControlledTextInput, ControlledImageInput } =
    createConnectedInputHelpers<UpdateUserInfo>();

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  const inputClassName = "[&_label]:uppercase [&_label]:text-[11px] [&_label]:font-semibold [&_label]:tracking-[0.33px] [&_label]:text-gray-500 [&_label]:mb-1 [&_input]:bg-[#f5f5f5] [&_input]:border-[#e0e0e0] [&_input]:h-[40px] [&_input]:rounded [&_input]:px-3 [&_input]:text-sm";

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-5xl font-semibold tracking-tight font-barlow-semi-condensed">
        <span className="text-[#e31b22]">Bienvenue</span>
        <span> {user.firstName}</span>
      </h1>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-[20px] p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold font-barlow-semi-condensed">Informations générales</h2>
              <p className="text-sm text-gray-500">
                Contrary to popular belief, Lorem Ipsum is not simply random text.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <ControlledImageInput
                  name="profileImage"
                  label="Photo de profil"
                  direction="horizontal"
                  className="py-2"
                />

              <div className="flex gap-5">
                <div className="flex-1">
                  <ControlledTextInput
                    name="lastName"
                    label="Nom"
                    placeholder="Votre nom"
                    className={inputClassName}
                  />
                </div>
                <div className="flex-1">
                  <ControlledTextInput
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="w-full">
                 <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider mb-1">Email</label>
                    <div className="bg-[#f5f5f5] border border-[#e0e0e0] rounded px-3 py-2 text-gray-500 text-sm h-[40px] flex items-center w-full">
                      {user.email}
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
               <Button type="submit" isLoading={isUpdating}>Enregistrer</Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
