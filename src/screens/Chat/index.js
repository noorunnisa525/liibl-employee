import React, {useEffect, useState} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {profileData} from '../../data/newMemory';
import ChatCard from '../../components/ChatCard';
import {useKeyboard} from '@react-native-community/hooks';
import {
  notificationSvg as NotificationSvg,
  NoChatSvg,
} from '../../../assets/Icons/Svgs';
import SearchBar from '../../components/SearchBar';
import {hp} from '../../util';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import {find_chat, get_all_chats, get_chat} from '../../services/api-confog';
import {useIsFocused, useRoute} from '@react-navigation/native';
import moment from 'moment';

function Chat({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const keyboard = useKeyboard();
  const [getChatCall, getChatResponse] = usePostApiMutation();
  const [pageNo, setPageNo] = useState(1);
  const [nextPageURL, setNextPageURL] = useState();
  const [getChatList, setChatList] = useState();
  const accessToken = useSelector(state => state.user.access_token);
  const [searching, setSearching] = useState('');
  const [filteredChatList, setFilteredChatList] = useState([]);
  const employeeData = useSelector(state => state.user.employeeData);
  const route = useRoute();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) onRefresh();
  }, [isFocused]);

  const onRefresh = () => {
    let getChatPageNo = pageNo;
    getChatApi(getChatPageNo);
    setIsFetching(false);
  };

  const getChatApi = async pageNo => {
    let apiData = {
      url: get_all_chats + pageNo,
      method: 'GET',
      token: accessToken,
    };
    try {
      let getChat = await getChatCall(apiData).unwrap();
      if (getChat.status == 200) {
        setNextPageURL(getChat.data.next_page_url);
        setPageNo(getChat.data.current_page);
        setChatList(getChat.data.data);
        setFilteredChatList(getChat.data.data);
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

  const onChangeText = text => {
    if (text) {
      const newData = filteredChatList.filter(function (item) {
        const itemData =
          employeeData.id == item.sender.id
            ? item.receiver.name.toLowerCase()
            : item.sender.name.toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setChatList(newData);
      setSearching(text);
    } else {
      setChatList(filteredChatList);
      setSearching(text);
    }
  };
  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <NoChatSvg />
        <Text style={styles.emptyMessageStyle}>No chat available</Text>
      </View>
    );
  };
  const renderChat = ({item}) => {
    return (
      <ChatCard
        name={
          employeeData?.id == item?.sender?.id
            ? item?.receiver?.name
            : item?.sender?.name
        }
        message={
          item?.last_message?.file_path ? 'Image' : item?.last_message?.message
        }
        img={
          employeeData?.id == item.sender.id
            ? item.receiver.image
            : item.sender.image
        }
        time={moment(item?.last_message?.created_at).fromNow()}
        onPress={() => {
          navigation.navigate('Inbox', {
            name:
              employeeData?.id == item?.sender?.id
                ? item?.receiver?.name
                : item?.sender?.name,
            id:
              employeeData?.id == item?.sender?.id
                ? item?.receiver?.id
                : item?.sender?.id,
            image:
              employeeData?.id == item.sender.id
                ? item.receiver.image
                : item.sender.image,
          });
        }}
      />
    );
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        centerComponent={<Text style={styles.headerInitialText}>Chats</Text>}
        // rightComponent={<NotificationSvg />}
      />
      <SearchBar
        placeholder="Search for Chat"
        value={searching}
        onChangeText={txt => onChangeText(txt)}
        container={styles.searchContainer}
      />
      <View style={styles.container}>
        {getChatResponse.isLoading ? (
          <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
        ) : (
          <FlatList
            data={getChatList}
            renderItem={renderChat}
            contentContainerStyle={{flexGrow: 1}}
            numColumns={1}
            refreshing={isFetching}
            onRefresh={onRefresh}
            keyExtractor={item => item?.name}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={() => {
              return <View style={{height: hp(20)}}></View>;
            }}
          />
        )}
      </View>
    </View>
  );
}
export default Chat;
