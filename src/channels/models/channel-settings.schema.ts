import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ _id: false })
export class ChannelSettings {
  @Prop()
  logo: string;

  @Prop()
  seeWhileTyping: boolean;

  @Prop()
  showRaychatCredit: boolean;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  infoForm: {
    isEnabled: boolean;
    isOptional: boolean;
    type: string;
  };

  @Prop({ type: [SchemaTypes.Mixed], required: false })
  widgetLandings: {
    laguage: string;
    title: string;
    description: string;
    startMessage: string;
    startReply: string;
  }[];

  @Prop({ type: SchemaTypes.Mixed, required: false })
  widgetCustomization: {
    logo: string;
    bgColor: string;
    loBgColor: string;
    secondaryColor: string;
    bgTheme: string;
  };

  @Prop({ type: SchemaTypes.Mixed, required: false })
  widgetDisplay: {
    show: {
      isEnabled: boolean;
      pages: string[];
    };
    doNotShow: {
      isEnabled: boolean;
      pages: string[];
    };
  };

  @Prop({ type: SchemaTypes.Mixed, required: false })
  position: {
    ltr: {
      position: string;
      bottom: number;
      right: number;
      showInMobile: boolean;
    };
    rtl: {
      position: string;
      bottom: number;
      left: number;
      showInMobile: boolean;
    };
  };
}
