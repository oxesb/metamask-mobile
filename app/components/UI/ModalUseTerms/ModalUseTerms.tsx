import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../../../../locales/i18n';
import ButtonIcon from '../../../component-library/components/Buttons/Button/variants/ButtonIcon';
import { IconName } from '../../../component-library/components/Icon';
import { ButtonVariants } from '../../../component-library/components/Buttons/Button';
import Text from '../../../component-library/components/Texts/Text';
import Checkbox from '../../../component-library/components/Checkbox';
import { useStyles } from '../../../component-library/hooks';
import en from '../../../../locales/languages/en';
import { TRUE, USE_TERMS } from '../../../constants/storage';
import stylesheet from './ModalUseTerms.styles';
import { ModalUseTermsI } from './ModalUseTerms.types';
import ModalMandatory from '../../../component-library/components/Modals/ModalMandatory';

const ModalUseTerms = ({ onDismiss }: ModalUseTermsI) => {
  const { styles } = useStyles(stylesheet, {});

  const [isTermsSelected, setIsTermsSelected] = useState(false);
  const [isFloatingButton, setIsFloatingButtonBackground] = useState(true);

  const scrollRef = useRef<ScrollView>(null);

  const scrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const renderScrollEndButton = () => (
    <View
      style={[
        styles.scrollToEndButton,
        // eslint-disable-next-line react-native/no-inline-styles
        !isFloatingButton && {
          display: 'none',
        },
      ]}
    >
      <ButtonIcon
        onPress={scrollToEnd}
        iconName={IconName.ArrowDownOutline}
        variant={ButtonVariants.Icon}
      />
    </View>
  );

  const handleSelect = () => {
    setIsTermsSelected(!isTermsSelected);
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;

    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      setIsFloatingButtonBackground(false);
    } else {
      setIsFloatingButtonBackground(true);
    }
  };

  const onConfirmUseTerms = async () => {
    await AsyncStorage.setItem(USE_TERMS, TRUE);
    onDismiss();
  };

  return (
    <ModalMandatory
      buttonText={strings('terms_of_use_modal.accept_cta')}
      buttonDisabled={!isTermsSelected}
      headerTitle={strings('terms_of_use_modal.title')}
      onPress={onConfirmUseTerms}
      footerHelpText={strings('terms_of_use_modal.accept_helper_description')}
    >
      <ScrollView
        ref={scrollRef}
        onScroll={({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) =>
          isCloseToBottom(nativeEvent)
        }
        scrollEventThrottle={50}
      >
        <View style={styles.termsAndConditionsContainer}>
          {Object.keys(en.terms_of_use).map((key) => (
            <Text key={key}>{strings(`terms_of_use.${key}`)}</Text>
          ))}
          <View style={styles.acceptTermsContainer}>
            <TouchableOpacity onPress={handleSelect} activeOpacity={1}>
              <Checkbox isSelected={isTermsSelected} style={styles.checkBox} />
            </TouchableOpacity>
            <Text style={styles.checkBoxText}>
              {strings('terms_of_use_modal.terms_of_use_check_description')}
            </Text>
          </View>
        </View>
      </ScrollView>
      {renderScrollEndButton()}
    </ModalMandatory>
  );
};

export default ModalUseTerms;
