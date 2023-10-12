import { Language } from 'src/common/languages.enum';
import { ChannelSettings } from './models/channel-settings.schema';

export const channelDefaultSetting: ChannelSettings = {
  logo: 'uploads/channel-photos/channel-web.png',
  seeWhileTyping: false,
  showRaychatCredit: true,
  infoForm: {
    isEnabled: false,
    isOptional: true,
    type: 'name',
  },
  widgetLandings: [
    {
      laguage: Language.PERSIAN,
      title: 'سیستم پشتیبانی آنلاین رایچت',
      description: 'توضیحات',
      startMessage: 'ارسال پیام برای ما',
      startReply: 'ما به زودی پاسخگوی شما هستیم',
    },
    {
      laguage: Language.ENGLISH,
      title: 'Raychat Customer Service',
      description: 'Description',
      startMessage: 'Ask us anything',
      startReply: 'We will reply to you as soon as possible!',
    },
  ],
  widgetCustomization: {
    logo: 'uploads/channel-photos/widget-web.png',
    bgColor: '#841474',
    loBgColor: '#ffffff',
    secondaryColor: '#841474',
    bgTheme: 'default',
  },
  widgetDisplay: {
    show: {
      isEnabled: false,
      pages: [],
    },
    doNotShow: {
      isEnabled: false,
      pages: [],
    },
  },
  position: {
    ltr: {
      position: 'bottom-right',
      bottom: 15,
      right: 15,
      showInMobile: false,
    },
    rtl: {
      position: 'bottom-left',
      bottom: 15,
      left: 15,
      showInMobile: false,
    },
  },
};
