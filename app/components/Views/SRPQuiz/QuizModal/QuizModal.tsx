import React, { useState, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReusableModal, { ReusableModalRef } from '../../../UI/ReusableModal';
import { ButtonVariants } from '../../../../component-library/components/Buttons/Button';
import Icon, {
  IconSize,
  IconName,
} from '../../../../component-library/components/Icon';
import { useStyles } from '../../../hooks/useStyles';
import { strings } from '../../../../../locales/i18n';

import { QuizStage } from '../types';
import { quiz } from '../quizStructure';
import { QuizContent } from '../QuizContent';
import stylesheet from './styles';

const QuizModal = () => {
  const modalRef = useRef<ReusableModalRef>(null);
  const [stage, setStage] = useState<QuizStage>(QuizStage.introduction);
  const { styles, theme } = useStyles(stylesheet, {});
  const { colors } = theme;
  const navigation = useNavigation();

  const dismissModal = () => {
    modalRef.current?.dismissModal();
  };

  const wrongAnswerIcon = useCallback(
    () => (
      <Icon
        size={IconSize.Xl}
        name={IconName.DangerFilled}
        color={colors.error.default}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const rightAnswerIcon = useCallback(
    () => (
      <Icon
        size={IconSize.Xl}
        name={IconName.CheckCircleOnFilled}
        color={colors.success.default}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const goToRevealPrivateCredential = () => {
    navigation.navigate('RevealPrivateCredentialView', {
      privateCredentialName: 'seed_phrase',
    });
  };

  const quizPage = useCallback(() => {
    switch (stage) {
      case QuizStage.introduction:
        return (
          <QuizContent
            header={quiz.introduction.header}
            title={{
              content: quiz.introduction.title,
            }}
            buttons={[
              {
                label: strings('srp_security_quiz.get_started'),
                onPress: () => setStage(QuizStage.questionOne),
                variant: ButtonVariants.Primary,
              },
            ]}
            dismiss={dismissModal}
          />
        );
      case QuizStage.questionOne:
        return (
          <QuizContent
            header={quiz.questionOne.header}
            title={{
              content: quiz.questionOne.content,
            }}
            buttons={[
              {
                label: quiz.questionOne.answers.incorrect,
                onPress: () => setStage(QuizStage.wrongAnswerQuestionOne),
                variant: ButtonVariants.Secondary,
              },
              {
                label: quiz.questionOne.answers.correct,
                onPress: () => setStage(QuizStage.rightAnswerQuestionOne),
                variant: ButtonVariants.Secondary,
              },
            ]}
            dismiss={dismissModal}
          />
        );
      case QuizStage.rightAnswerQuestionOne:
        return (
          <QuizContent
            header={quiz.questionOneCorrectInformation.header}
            icon={rightAnswerIcon}
            title={{
              content: quiz.questionOneCorrectInformation.title,
              style: styles.rightText,
            }}
            content={quiz.questionOneCorrectInformation.description}
            buttons={[
              {
                label: strings('srp_security_quiz.continue'),
                onPress: () => setStage(QuizStage.questionTwo),
                variant: ButtonVariants.Primary,
              },
            ]}
            dismiss={dismissModal}
          />
        );
      case QuizStage.wrongAnswerQuestionOne:
        return (
          <QuizContent
            header={quiz.questionOneIncorrectInformation.header}
            icon={wrongAnswerIcon}
            title={{
              content: quiz.questionOneIncorrectInformation.title,
              style: styles.wrongText,
            }}
            content={quiz.questionOneIncorrectInformation.description}
            buttons={[
              {
                label: strings('srp_security_quiz.try_again'),
                onPress: () => setStage(QuizStage.questionOne),
                variant: ButtonVariants.Primary,
              },
            ]}
            dismiss={dismissModal}
          />
        );
      case QuizStage.questionTwo:
        return (
          <QuizContent
            header={quiz.questionTwo.header}
            title={{
              content: quiz.questionTwo.content,
            }}
            buttons={[
              {
                label: quiz.questionTwo.answers.correct,
                onPress: () => setStage(QuizStage.rightAnswerQuestionTwo),
                variant: ButtonVariants.Secondary,
              },
              {
                label: quiz.questionTwo.answers.incorrect,
                onPress: () => setStage(QuizStage.wrongAnswerQuestionTwo),
                variant: ButtonVariants.Secondary,
              },
            ]}
            dismiss={dismissModal}
          />
        );
      case QuizStage.rightAnswerQuestionTwo:
        return (
          <QuizContent
            header={quiz.questionTwoCorrectInformation.header}
            icon={rightAnswerIcon}
            title={{
              content: quiz.questionTwoCorrectInformation.title,
              style: styles.rightText,
            }}
            content={quiz.questionTwoCorrectInformation.description}
            buttons={[
              {
                label: strings('srp_security_quiz.continue'),
                onPress: goToRevealPrivateCredential,
                variant: ButtonVariants.Primary,
              },
            ]}
            dismiss={dismissModal}
          />
        );
      case QuizStage.wrongAnswerQuestionTwo:
        return (
          <QuizContent
            header={quiz.questionTwoIncorrectInformation.header}
            icon={wrongAnswerIcon}
            title={{
              content: quiz.questionTwoIncorrectInformation.title,
              style: styles.wrongText,
            }}
            content={quiz.questionTwoIncorrectInformation.description}
            buttons={[
              {
                label: strings('srp_security_quiz.try_again'),
                onPress: () => setStage(QuizStage.questionTwo),
                variant: ButtonVariants.Primary,
              },
            ]}
            dismiss={dismissModal}
          />
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, stage, rightAnswerIcon, wrongAnswerIcon]);

  return (
    <ReusableModal ref={modalRef} style={styles.screen}>
      <View style={styles.modal}>{quizPage()}</View>
    </ReusableModal>
  );
};

export default QuizModal;