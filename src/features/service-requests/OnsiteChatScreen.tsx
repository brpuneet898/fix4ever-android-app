import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../core/theme';

interface ServiceRequest {
  _id: string;
  brand: string;
  model: string;
  serviceType?: string;
  preferredDate?: string;
  preferredTime?: string;
  assignedTechnician?: {
    _id: string;
    pocInfo: { fullName: string; email: string; phone: string };
  };
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'customer' | 'technician' | 'crm';
  timestamp: number;
  type: 'text' | 'system';
}

interface RescheduleRequest {
  id: string;
  proposedTime: string;
  status: 'pending_crm' | 'awaiting_customer' | 'accepted' | 'rejected' | 'customer_proposed';
  customerProposedTime?: string;
}

const CHAT_KEY = (id: string) => `@fix4ever/chat_${id}`;
const RESCHEDULE_KEY = (id: string) => `@fix4ever/reschedule_${id}`;

const FONTS = {
  regular: 'Montserrat-Regular',
  medium: 'Montserrat-Medium',
  semibold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
} as const;

function makeInitialMessages(techName: string): ChatMessage[] {
  const now = Date.now();
  return [
    {
      id: 'sys-init',
      text: 'This conversation is monitored by Fix4Ever CRM. Neither party\'s direct contact details are shared.',
      sender: 'crm',
      timestamp: now - 300_000,
      type: 'system',
    },
    {
      id: 'tech-init',
      text: `Hi! I'm ${techName}. I'll be arriving at your scheduled time. Let me know if you have any questions!`,
      sender: 'technician',
      timestamp: now - 180_000,
      type: 'text',
    },
  ];
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function OnsiteChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceRequest } = route.params as { serviceRequest: ServiceRequest };
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  const techName = serviceRequest.assignedTechnician?.pocInfo.fullName ?? 'Technician';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [reschedule, setReschedule] = useState<RescheduleRequest | null>(null);
  const [showTimeSuggestion, setShowTimeSuggestion] = useState(false);
  const [suggestedTimeText, setSuggestedTimeText] = useState('');

  const flatListRef = useRef<FlatList>(null);
  const crmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [rawMsgs, rawReschedule] = await Promise.all([
          AsyncStorage.getItem(CHAT_KEY(serviceRequest._id)),
          AsyncStorage.getItem(RESCHEDULE_KEY(serviceRequest._id)),
        ]);
        setMessages(rawMsgs ? JSON.parse(rawMsgs) : makeInitialMessages(techName));
        setReschedule(rawReschedule ? JSON.parse(rawReschedule) : null);
      } catch {
        setMessages(makeInitialMessages(techName));
      } finally {
        setIsLoaded(true);
      }
    };
    load();
    return () => {
      if (crmTimerRef.current) clearTimeout(crmTimerRef.current);
    };
  }, [serviceRequest._id, techName]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(CHAT_KEY(serviceRequest._id), JSON.stringify(messages)).catch(() => {});
  }, [messages, isLoaded, serviceRequest._id]);

  useEffect(() => {
    if (!isLoaded) return;
    if (reschedule) {
      AsyncStorage.setItem(RESCHEDULE_KEY(serviceRequest._id), JSON.stringify(reschedule)).catch(() => {});
    } else {
      AsyncStorage.removeItem(RESCHEDULE_KEY(serviceRequest._id)).catch(() => {});
    }
  }, [reschedule, isLoaded, serviceRequest._id]);

  const addMessage = useCallback(
    (partial: Pick<ChatMessage, 'text' | 'sender' | 'type'>) => {
      const msg: ChatMessage = {
        ...partial,
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, msg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
    },
    []
  );

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    addMessage({ text, sender: 'customer', type: 'text' });
    setInputText('');
    setTimeout(() => {
      addMessage({ text: '[Via CRM] Message delivered to technician.', sender: 'crm', type: 'system' });
    }, 1500);
  };

  const handleCallViaCRM = () => {
    Alert.alert(
      'Call via Fix4Ever CRM',
      "Your call will be routed through Fix4Ever's secure CRM. Neither party's contact details will be shared.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect Call',
          onPress: () =>
            Alert.alert('Connecting...', 'Routing call through Fix4Ever CRM. Please wait a moment.'),
        },
      ]
    );
  };

  const simulateRescheduleRequest = () => {
    if (reschedule && reschedule.status !== 'accepted' && reschedule.status !== 'rejected') {
      Alert.alert('In Progress', 'A reschedule request is already pending.');
      return;
    }
    const newR: RescheduleRequest = {
      id: `rs-${Date.now()}`,
      proposedTime: 'Tomorrow, 3:00 PM – 4:00 PM',
      status: 'pending_crm',
    };
    setReschedule(newR);
    addMessage({
      text: '[CRM] Technician has requested a time change. Under CRM review...',
      sender: 'crm',
      type: 'system',
    });
    crmTimerRef.current = setTimeout(() => {
      setReschedule(prev => (prev ? { ...prev, status: 'awaiting_customer' } : null));
      addMessage({
        text: '[CRM] Reschedule request approved. Please respond below.',
        sender: 'crm',
        type: 'system',
      });
    }, 3000);
  };

  const acceptReschedule = () => {
    if (!reschedule) return;
    setReschedule({ ...reschedule, status: 'accepted' });
    addMessage({ text: `You accepted the reschedule to ${reschedule.proposedTime}.`, sender: 'customer', type: 'text' });
    addMessage({ text: '[CRM] Response noted. The technician has been informed.', sender: 'crm', type: 'system' });
  };

  const submitSuggestedTime = () => {
    const time = suggestedTimeText.trim();
    if (!reschedule || !time) return;
    setReschedule({ ...reschedule, status: 'customer_proposed', customerProposedTime: time });
    addMessage({ text: `You suggested an alternative time: "${time}". CRM will review and notify the technician.`, sender: 'customer', type: 'text' });
    addMessage({ text: '[CRM] Your suggestion is under review. We\'ll notify both parties once confirmed.', sender: 'crm', type: 'system' });
    setShowTimeSuggestion(false);
    setSuggestedTimeText('');
  };

  const rejectTechnician = () => {
    Alert.alert(
      'Reject Technician',
      'Are you sure? A new technician will be assigned by Fix4Ever.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setReschedule(prev => (prev ? { ...prev, status: 'rejected' } : null));
            addMessage({ text: 'You rejected the technician. Fix4Ever will assign a replacement shortly.', sender: 'customer', type: 'text' });
            addMessage({ text: '[CRM] Request noted. A new technician will be assigned as soon as possible.', sender: 'crm', type: 'system' });
          },
        },
      ]
    );
  };

  const showPendingReschedule =
    reschedule &&
    reschedule.status !== 'accepted' &&
    reschedule.status !== 'rejected';

  const showSimulateButton =
    !reschedule ||
    reschedule.status === 'accepted' ||
    reschedule.status === 'rejected';

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.type === 'system') {
      return (
        <View
          style={[
            s.systemMsg,
            { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}25` },
          ]}
        >
          <Icon name="shield" size={11} color={colors.primary} />
          <Text style={[s.systemMsgText, { color: colors.primary, fontFamily: FONTS.medium }]}>
            {item.text}
          </Text>
        </View>
      );
    }

    const isCustomer = item.sender === 'customer';
    return (
      <View style={[s.msgRow, isCustomer && s.msgRowRight]}>
        {!isCustomer && (
          <View style={[s.avatar, { backgroundColor: colors.primary }]}>
            <Icon name="user" size={11} color="#fff" />
          </View>
        )}
        <View style={{ maxWidth: '72%' }}>
          {!isCustomer && (
            <Text style={[s.senderLabel, { color: colors.mutedForeground, fontFamily: FONTS.medium }]}>
              Technician
            </Text>
          )}
          <View
            style={[
              s.bubble,
              isCustomer
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
            ]}
          >
            <Text
              style={[
                s.bubbleText,
                { color: isCustomer ? '#fff' : colors.foreground, fontFamily: FONTS.regular },
              ]}
            >
              {item.text}
            </Text>
          </View>
          <Text
            style={[
              s.timeLabel,
              { color: colors.mutedForeground, fontFamily: FONTS.regular },
              isCustomer && { textAlign: 'right' },
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          s.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={[s.headerTitle, { color: colors.foreground, fontFamily: FONTS.semibold }]}
            numberOfLines={1}
          >
            {techName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={[s.onlineDot, { backgroundColor: colors.primary }]} />
            <Text
              style={[s.headerSub, { color: colors.mutedForeground, fontFamily: FONTS.regular }]}
            >
              via Fix4Ever CRM
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleCallViaCRM}
          style={[s.callBtn, { backgroundColor: `${colors.primary}18` }]}
        >
          <Icon name="phone" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {!isLoaded ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: spacing.md, paddingBottom: 4 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListFooterComponent={
              showPendingReschedule && reschedule ? (
                <View
                  style={[
                    s.rescheduleCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: `${colors.warning}55`,
                      borderRadius: borderRadius.lg,
                    },
                  ]}
                >
                  <View style={s.rescheduleHeader}>
                    <Icon name="clock" size={15} color={colors.warning} />
                    <Text
                      style={[s.rescheduleTitle, { color: colors.foreground, fontFamily: FONTS.semibold, flex: 1 }]}
                    >
                      Reschedule Request
                    </Text>
                    {reschedule.status === 'pending_crm' && (
                      <View style={[s.badge, { backgroundColor: `${colors.warning}20` }]}>
                        <ActivityIndicator size={9} color={colors.warning} />
                        <Text style={[s.badgeText, { color: colors.warning, fontFamily: FONTS.medium }]}>
                          CRM Review
                        </Text>
                      </View>
                    )}
                    {reschedule.status === 'awaiting_customer' && (
                      <View style={[s.badge, { backgroundColor: `${colors.primary}20` }]}>
                        <Icon name="check-circle" size={10} color={colors.primary} />
                        <Text style={[s.badgeText, { color: colors.primary, fontFamily: FONTS.medium }]}>
                          CRM Approved
                        </Text>
                      </View>
                    )}
                    {reschedule.status === 'customer_proposed' && (
                      <View style={[s.badge, { backgroundColor: `${colors.warning}20` }]}>
                        <ActivityIndicator size={9} color={colors.warning} />
                        <Text style={[s.badgeText, { color: colors.warning, fontFamily: FONTS.medium }]}>
                          Under Review
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={[s.rescheduleBody, { color: colors.mutedForeground, fontFamily: FONTS.regular }]}>
                    Technician proposed:{' '}
                    <Text style={{ color: colors.foreground, fontFamily: FONTS.semibold }}>
                      {reschedule.proposedTime}
                    </Text>
                  </Text>

                  {reschedule.status === 'awaiting_customer' && (
                    <View style={s.rescheduleActions}>
                      <TouchableOpacity
                        style={[s.rsBtn, { backgroundColor: colors.primary }]}
                        onPress={acceptReschedule}
                      >
                        <Icon name="check" size={13} color="#fff" />
                        <Text style={[s.rsBtnText, { color: '#fff', fontFamily: FONTS.semibold }]}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.rsBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                        onPress={() => setShowTimeSuggestion(true)}
                      >
                        <Icon name="edit-2" size={13} color={colors.foreground} />
                        <Text style={[s.rsBtnText, { color: colors.foreground, fontFamily: FONTS.semibold }]}>
                          Suggest Time
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          s.rsBtn,
                          { backgroundColor: `${colors.destructive}15`, borderColor: `${colors.destructive}40`, borderWidth: 1 },
                        ]}
                        onPress={rejectTechnician}
                      >
                        <Icon name="x" size={13} color={colors.destructive} />
                        <Text style={[s.rsBtnText, { color: colors.destructive, fontFamily: FONTS.semibold }]}>
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {reschedule.status === 'customer_proposed' && (
                    <Text
                      style={[{ fontSize: 12, marginTop: 8, color: colors.mutedForeground, fontFamily: FONTS.regular }]}
                    >
                      Your suggestion "{reschedule.customerProposedTime}" is being reviewed by CRM.
                    </Text>
                  )}
                </View>
              ) : null
            }
          />
        )}

        {/* Prototype: simulate reschedule trigger */}
        {showSimulateButton && (
          <TouchableOpacity
            style={[s.simulateBtn, { backgroundColor: `${colors.warning}12`, borderColor: `${colors.warning}35` }]}
            onPress={simulateRescheduleRequest}
          >
            <Icon name="refresh-cw" size={12} color={colors.warning} />
            <Text style={[s.simulateBtnText, { color: colors.warning, fontFamily: FONTS.medium }]}>
              [Prototype] Simulate technician reschedule request
            </Text>
          </TouchableOpacity>
        )}

        {/* Input bar */}
        <View
          style={[
            s.inputRow,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
            },
          ]}
        >
          <TextInput
            style={[
              s.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
                fontFamily: FONTS.regular,
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[s.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : colors.border }]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Icon name="send" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Suggest Time Modal */}
      <Modal
        visible={showTimeSuggestion}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeSuggestion(false)}
      >
        <View style={[s.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View
            style={[
              s.modalCard,
              { backgroundColor: colors.card, borderRadius: borderRadius.xl },
            ]}
          >
            <Text style={[s.modalTitle, { color: colors.foreground, fontFamily: FONTS.semibold }]}>
              Suggest a New Time
            </Text>
            <Text style={[s.modalBody, { color: colors.mutedForeground, fontFamily: FONTS.regular }]}>
              Enter your preferred date and time. CRM will review it before notifying the technician.
            </Text>
            <TextInput
              style={[
                s.modalInput,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.background,
                  fontFamily: FONTS.regular,
                },
              ]}
              value={suggestedTimeText}
              onChangeText={setSuggestedTimeText}
              placeholder="e.g. Tomorrow, 5:00 PM – 6:00 PM"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtn, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => setShowTimeSuggestion(false)}
              >
                <Text style={[s.modalBtnText, { color: colors.foreground, fontFamily: FONTS.semibold }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalBtn, { backgroundColor: suggestedTimeText.trim() ? colors.primary : colors.border }]}
                onPress={submitSuggestedTime}
                disabled={!suggestedTimeText.trim()}
              >
                <Text style={[s.modalBtnText, { color: '#fff', fontFamily: FONTS.semibold }]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16 },
  headerSub: { fontSize: 12 },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  callBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

  systemMsg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
    alignSelf: 'center',
    maxWidth: '92%',
  },
  systemMsgText: { fontSize: 11, flex: 1, lineHeight: 16 },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, marginVertical: 4 },
  msgRowRight: { flexDirection: 'row-reverse' },
  avatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  senderLabel: { fontSize: 11, marginBottom: 2 },
  bubble: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 16 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  timeLabel: { fontSize: 10, marginTop: 3 },

  rescheduleCard: { borderWidth: 1, padding: 12, marginTop: 10, marginBottom: 4 },
  rescheduleHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  rescheduleTitle: { fontSize: 14 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11 },
  rescheduleBody: { fontSize: 13, lineHeight: 18 },
  rescheduleActions: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  rsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  rsBtnText: { fontSize: 13 },

  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  simulateBtnText: { fontSize: 12 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 7,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: {
    width: '100%',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: { fontSize: 17, marginBottom: 8 },
  modalBody: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  modalInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  modalBtnText: { fontSize: 15 },
});
