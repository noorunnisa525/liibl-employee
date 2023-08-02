import React, {useCallback, useState} from 'react';
import {View, Text} from 'react-native';
import Slider from 'rn-range-slider';
import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';

const SliderScreen = () => {
  const [rangeDisabled, setRangeDisabled] = useState(false);
  const [low, setLow] = useState(0.0);
  const [high, setHigh] = useState(5.0);
  const [min, setMin] = useState(0.0);
  const [max, setMax] = useState(5.0);
  const [floatingLabel, setFloatingLabel] = useState(false);
  const styles = useThemeAwareObject(createStyles);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);
  const toggleRangeEnabled = useCallback(
    () => setRangeDisabled(!rangeDisabled),
    [rangeDisabled],
  );
  const setMinTo50 = useCallback(() => setMin(50), []);
  const setMinTo0 = useCallback(() => setMin(0), []);
  const setMaxTo100 = useCallback(() => setMax(100), []);
  const setMaxTo500 = useCallback(() => setMax(500), []);
  const toggleFloatingLabel = useCallback(
    () => setFloatingLabel(!floatingLabel),
    [floatingLabel],
  );

  return (
    <View style={styles.root}>
      <Slider
        style={styles.slider}
        min={min}
        max={max}
        step={0.5}
        disableRange={rangeDisabled}
        floatingLabel={floatingLabel}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
      />
      <View style={styles.horizontalContainer}>
        <Text style={styles.valueText}>{low}</Text>
        <Text style={styles.valueText}>{high}</Text>
      </View>
      <View style={styles.horizontalContainer}></View>
    </View>
  );
};

export default SliderScreen;
