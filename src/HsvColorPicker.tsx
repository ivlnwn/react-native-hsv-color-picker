import React, {forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef} from 'react';
import {View, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import HuePicker from './HuePicker';
import SaturationValuePicker from './SaturationValuePicker';

interface Props {
  containerStyle: StyleProp<ViewStyle>;
  huePickerContainerStyle: StyleProp<ViewStyle>;
  huePickerBorderRadius: number;
  huePickerHue: number;
  huePickerBarWidth: number;
  huePickerBarHeight: number;
  huePickerSliderSize: number;
  onHuePickerDragStart: (huePicker: {hue: number}) => void;
  onHuePickerDragMove: (huePicker: {hue: number}) => void;
  onHuePickerDragEnd: (huePicker: {hue: number}) => void;
  onHuePickerDragTerminate: (huePicker: {hue: number}) => void;
  onHuePickerPress: (huePicker: {hue: number}) => void;
  satValPickerContainerStyle: StyleProp<ViewStyle>;
  satValPickerBorderRadius: number;
  satValPickerHeight: number;
  satValPickerWidth: number;
  satValPickerSliderSize: number;
  satValPickerHue: number;
  satValPickerSaturation: number;
  satValPickerValue: number;
  onSatValPickerDragStart: (satValPicker: {saturation: number; value: number}) => void;
  onSatValPickerDragMove: (satValPicker: {saturation: number; value: number}) => void;
  onSatValPickerDragEnd: (satValPicker: {saturation: number; value: number}) => void;
  onSatValPickerDragTerminate: (satValPicker: {saturation: number; value: number}) => void;
  onSatValPickerPress: (satValPicker: {saturation: number; value: number}) => void;
  huePickerArrangement?: 'horizontal' | 'vertical';
}

function HsvColorPicker(
  {
    containerStyle,
    huePickerContainerStyle,
    huePickerBorderRadius,
    huePickerHue,
    huePickerBarWidth,
    huePickerBarHeight,
    huePickerSliderSize,
    onHuePickerDragStart,
    onHuePickerDragMove,
    onHuePickerDragEnd,
    onHuePickerDragTerminate,
    onHuePickerPress,
    satValPickerContainerStyle,
    satValPickerBorderRadius,
    satValPickerHeight,
    satValPickerWidth,
    satValPickerSliderSize,
    satValPickerHue,
    satValPickerSaturation,
    satValPickerValue,
    onSatValPickerDragStart,
    onSatValPickerDragMove,
    onSatValPickerDragEnd,
    onSatValPickerDragTerminate,
    onSatValPickerPress,
    huePickerArrangement = 'vertical',
  }: Props,
  ref: React.Ref<any>,
): React.FunctionComponentElement<ForwardRefRenderFunction<any, Props>> {
  const satValPickerRef = useRef<any>();

  const getCurrentColor = () => satValPickerRef.current?.getCurrentColor;

  useImperativeHandle(ref, () => ({
    getCurrentColor,
  }));

  const flexDirection = huePickerArrangement === 'horizontal' ? 'column' : 'row';

  return (
    <View style={[styles.container, {flexDirection}, containerStyle]}>
      <SaturationValuePicker
        containerStyle={satValPickerContainerStyle}
        borderRadius={satValPickerBorderRadius}
        height={satValPickerHeight}
        width={satValPickerWidth}
        sliderSize={satValPickerSliderSize}
        hue={satValPickerHue}
        saturation={satValPickerSaturation}
        value={satValPickerValue}
        onDragStart={onSatValPickerDragStart}
        onDragMove={onSatValPickerDragMove}
        onDragEnd={onSatValPickerDragEnd}
        onDragTerminate={onSatValPickerDragTerminate}
        onPress={onSatValPickerPress}
        ref={satValPickerRef}
      />
      <HuePicker
        arrangement={huePickerArrangement}
        containerStyle={huePickerContainerStyle}
        borderRadius={huePickerBorderRadius}
        hue={huePickerHue}
        barWidth={huePickerBarWidth}
        barHeight={huePickerBarHeight}
        sliderSize={huePickerSliderSize}
        onDragStart={onHuePickerDragStart}
        onDragMove={onHuePickerDragMove}
        onDragEnd={onHuePickerDragEnd}
        onDragTerminate={onHuePickerDragTerminate}
        onPress={onHuePickerPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default forwardRef(HsvColorPicker);
