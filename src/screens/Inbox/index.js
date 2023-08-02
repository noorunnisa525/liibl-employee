import React, {useEffect, useRef, useState} from 'react';
import {View, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {hp, wp} from '../../util';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {clockSvg, sendIconSvg as SendIconSvg} from '../../../assets/Icons/Svgs';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {baseUrl} from '../../constants';
import {useSelector} from 'react-redux';
import {
  add_message,
  create_chat,
  find_chat,
  get_chat,
} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import io from 'socket.io-client';

function Inbox({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [openModal, setOpenModal] = useState(false);
  const route = useRoute();
  const {item} = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const a = new Date();
  const date = moment(a).format('Do MMMM, YYYY');
  const employeeData = useSelector(state => state.user.employeeData);
  const accessToken = useSelector(state => state.user.access_token);
  const [findChatCall, findChatResponse] = usePostApiMutation();
  const [getChatCall, getChatResponse] = usePostApiMutation();
  const [addMessageCall, setMessageCall] = usePostApiMutation();
  const [pageNo, setPageNo] = useState(1);
  const [nextPageURL, setNextPageURL] = useState();
  const [getChatList, setChatList] = useState();
  const [chatFound, setChatFound] = useState(false);
  const [findChatRes, setFindChatResponse] = useState();
  const isFocused = useIsFocused();
  const socket = useRef(null);

  useEffect(() => {
    if (isFocused) {
      findChatApi();
      return () => {
        socket.current.close();
      };
    }
  }, []);

  useEffect(() => {
    socket.current = io(baseUrl.socket, {
      transports: ['websocket'],
      jsonp: false,
      forceNew: true,
    });

    socket.current.on('connect', () => {
      console.log('Connection Established');
    });
  }, []);

  useEffect(() => {
    socket.current.on('message_receive', msg => {
      if (msg.message?.user?._id != employeeData?.id) {
        setMessages([msg.message, ...messages]);
      }
    });
  }, [messages]);

  const getChatApi = async (getChatPageNo, chatId) => {
    let data = {
      chat_id: chatId,
    };
    let apiData = {
      url: get_chat + getChatPageNo,
      method: 'POST',
      token: accessToken,
      data: data,
    };
    try {
      let getChat = await getChatCall(apiData).unwrap();
      if (getChat.status == 200) {
        setNextPageURL(getChat.data?.message?.next_page_url);
        setPageNo(getChat.data?.message?.current_page);
        setChatList(getChat.data?.message?.data);

        let temp = [];
        getChat.data.message.data.map(item => {
          let chatTemp = {};
          chatTemp['_id'] = item.id;
          chatTemp['text'] = item.message;
          chatTemp['createdAt'] = moment(item.created_at);
          chatTemp['user'] = {
            _id: item.sender.id,
            avatar:
              item.sender.image == null
                ? `https://ui-avatars.com/api/?background=${
                    item.sender.id == employeeData.id ? 'black' : 'white'
                  }&color=FFF&name=${item.sender.name}`
                : baseUrl.base + '/' + item.sender.image,
            name: item.sender.name,
          };
          temp.push(chatTemp);
        });

        let dateSort = temp.sort(function compare(a, b) {
          var dateA = new Date(a.createdAt);
          var dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setMessages([...dateSort]);
        setLoading(false);
      } else {
        Snackbar.show({
          text: getChat?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const findChatApi = async () => {
    let data = {
      receiver_id: route?.params?.id,
    };
    let apiData = {
      url: find_chat,
      data: data,
      method: 'POST',
      token: accessToken,
    };
    try {
      let apiResponse = await findChatCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        if (Object.keys(apiResponse.data) != '') {
          setChatFound(true);
          let getChatPageNo = pageNo;
          setFindChatResponse(apiResponse.data[0].chat_id);
          getChatApi(getChatPageNo, apiResponse.data[0].chat_id);
        } else {
          setChatFound(false);
        }
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setChatFound(false);
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const createChatApi = async text => {
    let createData = {
      sender_id: employeeData?.id,
      receiver_id: route.params.id,
      type: 'text',
      message: text,
    };
    let createApiData = {
      url: create_chat,
      method: 'POST',
      token: accessToken,
      data: createData,
    };
    try {
      let apiResponse = await findChatCall(createApiData).unwrap();
      if (apiResponse.status == 200) {
        setChatFound(true);
        setFindChatResponse(apiResponse.data.chat.id);
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setChatFound(false);
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.messageButton}>
          <SendIconSvg />
        </View>
      </Send>
    );
  }

  async function onSend(messages = []) {
    if (messages[0].text != '') {
      if (!chatFound) {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
        createChatApi(messages[0].text);
      } else {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
        let data = {
          chat_id: findChatRes,
          type: 'text',
          message: messages[0].text,
        };
        let createApiData = {
          url: add_message,
          method: 'POST',
          data: data,
          token: accessToken,
        };
        try {
          let apiResponse = await addMessageCall(createApiData).unwrap();
          if (apiResponse.status == 200) {
            socket.current.emit('message_send', {
              message: {
                _id: messages[0]._id,
                conversation: apiResponse.data.chat.id,
                text: messages[0].text,
                messageType: 'message',
                createdAt: messages[0].createdAt,
                user: {
                  _id: employeeData?.id,
                  avatar:
                    employeeData?.image == null
                      ? `https://ui-avatars.com/api/?background=${'black'}&color=FFF&name=${
                          employeeData.image
                        }`
                      : baseUrl.base + '/' + employeeData.image,
                  name: employeeData?.name,
                },
              },
            });
          } else {
            Snackbar.show({
              text: apiResponse?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
            setChatFound(false);
          }
        } catch (e) {
          console.log('Error', e);
        }
      }
    } else {
      Snackbar.show({
        text: 'Enter some text before pressing SEND',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }

  function renderInputToolbar(props) {
    return (
      <InputToolbar
        numberOfLines={1}
        {...props}
        containerStyle={styles.renderInputStyle}
      />
    );
  }

  function renderBubble(props) {
    var messageBelongsToCurrentUser =
      employeeData?.id == props.currentMessage.user._id;
    if (props.currentMessage.type == 'image') {
      let hold = [];
      let multi = false;

      hold = props.currentMessage?.file_path?.split(',');
    } else {
      return (
        <View>
          <Bubble
            {...props}
            textStyle={{
              right: {color: 'white', fontFamily: 'SofiaPro-SemiBold'},
              left: {
                color: 'black',
                fontFamily: 'SofiaPro-SemiBold',
              },
            }}
            wrapperStyle={{
              right: {
                backgroundColor: 'black',
                borderBottomRightRadius: 0,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              },
              left: {
                backgroundColor: 'white',
                borderBottomRightRadius: 20,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 0,
                borderWidth: hp(0.1),
                borderColor: 'lightgray',
              },
            }}
          />
          <Text
            style={
              messageBelongsToCurrentUser
                ? styles.currentUserTime
                : styles.otherUserTime
            }>
            {moment(props.currentMessage.createdAt).format('LT')}
          </Text>
        </View>
      );
    }
  }
  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        centerComponent={
          <View style={styles.middleContainer}>
            <Image
              source={{uri: baseUrl.base + '/' + route.params.image}}
              style={styles.middleContainerImage}
              resizeMode={'contain'}
            />
            <Text numberOfLines={1} style={styles.headerInitialText}>
              {route.params.name}
            </Text>
          </View>
        }
        leftComponent={
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </TouchableOpacity>
        }
      />

      <View style={{backgroundColor: '#ededed'}}>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.container}>
        {findChatResponse.isLoading ? (
          <View style={styles.activityView}>
            <ActivityIndicator size="large" color={'black'} />
          </View>
        ) : (
          <GiftedChat
            alwaysShowSend={true}
            messages={messages}
            onSend={messages => onSend(messages)}
            textInputStyle={styles.messageInputStyle}
            user={{
              _id: employeeData?.id,
              avatar:
                employeeData?.image == null
                  ? `https://ui-avatars.com/api/?background=${'black'}&color=FFF&name=${
                      employeeData?.name
                    }`
                  : baseUrl.base + '/' + employeeData?.image,
              name: employeeData?.name,
            }}
            showUserAvatar
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
            renderBubble={renderBubble}
            inverted
            isTyping
            infiniteScroll
            scrollToBottom
            renderTime={() => {
              return null;
            }}
            loadEarlier={Boolean(nextPageURL)}
            onLoadEarlier={() => {
              if (nextPageURL) {
                let temp = pageNo + 1;
                getChatApi(temp, findChatRes);
              }
            }}
          />
        )}
      </View>
    </View>
  );
}
export default Inbox;
