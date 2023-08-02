import React, {useRef, useEffect, useState, useCallback} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import CustomDropDown from '../../components/CustomDropdown';
import RangeSlider from '../../components/RangeSlider/index';
import {get_categories, get_sub_categories} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {useSelector} from 'react-redux';
import {wp} from '../../util';

function FilterScreen({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [appliedOpen, setAppliedOpen] = useState(false);
  const [appliedValue, setAppliedValue] = useState();
  const [appliedItem, setAppliedItem] = useState([
    // {label: 'All', value: 'all'},
    {label: 'Applied', value: 'applied'},
    {label: 'Non-Applied', value: 'non'},
  ]);
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [categoryValue, setCategoryValue] = useState();
  const [subValue, setSubValue] = useState();
  const [subCategoryValues, setSubCategoryValues] = useState();
  const [subCategories, setSubCategories] = useState([]);
  const [categoriesCall, getCategoriesResponse] = usePostApiMutation();
  const [subCategoriesCall, subCategoriesResponse] = useParamApiMutation();
  const accessToken = useSelector(state => state.user.access_token);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    otpRef?.current?.focusField(0);
  });
  useEffect(() => {
    getCategoriesApi();
  }, []);

  useEffect(() => {
    if (subValue?.length > 0) {
      let values = [];
      subValue.forEach(item => {
        let found = subCategories.find(el => el.value == item);
        values.push(found);
        setSubCategoryValues(values);
      });
    }
  }, [subValue]);

  const getCategoriesApi = async () => {
    let apiData = {
      url: get_categories,
      method: 'GET',
    };
    try {
      let getCategoryList = await categoriesCall(apiData).unwrap();
      if (getCategoryList.statusCode == 200) {
        let tempCategory = getCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setCategory(tempCategory);
      } else {
        Snackbar.show({
          text: getCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  const getSubCategoriesApi = async id => {
    setSubCategories([]);
    setSubValue([]);
    setSubCategoryValues([]);
    let apiData = {
      url: get_sub_categories,
      params: `category_id=${id}`,
      method: 'GET',
      token: accessToken,
    };
    try {
      let getSubCategoryList = await subCategoriesCall(apiData).unwrap();
      if (getSubCategoryList.statusCode == 200) {
        let tempSubCategories = getSubCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setSubCategories(tempSubCategories);
      } else {
        Snackbar.show({
          text: getSubCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
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
            />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() =>
              navigation.navigate('Home', {
                subValue: null,
                categoryValue: null,
              })
            }>
            <MaterialIcons name={'refresh'} size={wp(6.5)} color={'black'} />
          </TouchableOpacity>
        }
        centerComponent={<Text style={styles.headerInitialText}>Filter</Text>}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.optContainer}>
          <View>
            <Text style={styles.textFieldTitle}>Type</Text>
            <CustomDropDown
              value={appliedValue}
              setValue={setAppliedValue}
              open={appliedOpen}
              setOpen={setAppliedOpen}
              items={appliedItem}
              zIndex={100}
              setItems={setAppliedItem}
              placeholder={'Select Job Type'}
            />
            <Text style={styles.textFieldTitle}>Job Category</Text>
            <CustomDropDown
              value={categoryValue}
              setValue={setCategoryValue}
              onChangeValue={id => {
                getSubCategoriesApi(id);
              }}
              open={open}
              setOpen={setOpen}
              items={category}
              zIndex={10}
              setItems={setCategory}
              placeholder={'Select Job Category'}
            />
            <Text style={styles.textFieldTitle}>Job Sub-Category</Text>
            <CustomDropDown
              value={subValue}
              setValue={setSubValue}
              open={openSub}
              zIndex={5}
              setOpen={setOpenSub}
              items={subCategories}
              multiple={true}
              setItems={setSubCategories}
              placeholder={'Select Job Sub-Category'}
            />

            <Text style={styles.textFieldTitle}>Rating</Text>
            <View
              style={{
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              <RangeSlider />
            </View>
          </View>
        </View>
        <Button
          style={[styles.filterButton, styles.filterButtonText]}
          title1="Apply Filter"
          onPress={() =>
            navigation.navigate('Home', {
              subValue: subCategoryValues,
              categoryValue,
              type: appliedValue,
            })
          }
        />
      </ScrollView>
    </View>
  );
}

export default FilterScreen;
