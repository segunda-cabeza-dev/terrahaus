import { useTranslation } from 'react-i18next';

export default function TopBar() {
  const { t } = useTranslation();
  
  return (
    <div className="w-full bg-black text-white py-2">
      <div className="container mx-auto text-center">
        <p className="text-sm font-medium">{t('topbar.shipping')}</p>
      </div>
    </div>
  )
}
