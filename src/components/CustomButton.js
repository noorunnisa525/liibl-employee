import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useThemeAwareObject} from '../theme/index';
import Text from './CustomText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {hp, wp} from '../util';

function CustomButton(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      purpleColor: theme.color.primaryColor,
      whiteColor: theme.color.textWhite,
      disabledButton: {
        backgroundColor: theme.color.shadowColor,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <>
      {!props.loading ? (
        !props.disabled ? (
          <TouchableOpacity
            style={props?.style[0]}
            onPress={props.onPress}
            disabled={props.disable}>
            <View style={{flexDirection: 'row'}}>
              {props.icon && (
                <View
                  style={{
                    width: wp(7),
                    justifyContent: 'flex-start',
                  }}>
                  <FontAwesome
                    name={props.icon}
                    size={24}
                    color={props.iconColor}
                  />
                </View>
              )}
              {props.svg && (
                <View
                  style={{
                    width: wp(7),
                    justifyContent: 'flex-start',
                  }}>
                  {props.svg}
                </View>
              )}

              <Text style={props?.style[1]}>
                {props?.title1}
                {props.title2 && (
                  <Text onPress={props.onPressTitle2} style={props.style[2]}>
                    {props.title2}
                  </Text>
                )}
              </Text>
            </View>
            {props.children && props.children}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            style={[props.style[0], styles.disabledButton]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={props.style[1]}>{props.title1} </Text>
              {props.title2 && (
                <Text style={props.style[2]}> {props.title2}</Text>
              )}
            </View>
            {props.children && props.children}
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          disabled
          style={[props.style[0]]}
          onPress={props.onPress}>
          <ActivityIndicator color={props.loaderBlack ? 'black' : 'white'} />
        </TouchableOpacity>
      )}
    </>
  );
}

export default CustomButton;
