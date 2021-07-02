import React, {forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {View, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {colorConverter} from './utils';
import HuePicker from './HuePicker';
import SaturationValuePicker from './SaturationValuePicker';

interface Props {
  color: string | number[];
  onColorChange: (newColor: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  huePickerContainerStyle?: StyleProp<ViewStyle>;
  huePickerBorderRadius?: number;
  huePickerBarWidth?: number;
  huePickerBarHeight?: number;
  huePickerSliderSize?: number;
  satValPickerContainerStyle?: StyleProp<ViewStyle>;
  satValPickerBorderRadius?: number;
  satValPickerHeight?: number;
  satValPickerWidth?: number;
  satValPickerSliderSize?: number;
  huePickerArrangement?: 'horizontal' | 'vertical';
  huePickerBorderColorized?: boolean;
}

function HsvColorPicker(
  {
    onColorChange,
    color,
    containerStyle,
    huePickerContainerStyle,
    huePickerBorderRadius,
    huePickerBarWidth,
    huePickerBarHeight,
    huePickerSliderSize,
    satValPickerContainerStyle,
    satValPickerBorderRadius,
    satValPickerHeight,
    satValPickerWidth,
    satValPickerSliderSize,
    huePickerArrangement = 'vertical',
    huePickerBorderColorized = false,
  }: Props,
  ref: React.Ref<any>,
): React.FunctionComponentElement<ForwardRefRenderFunction<any, Props>> {

  const hsvColor = useMemo(() => {
    if (typeof color === 'string') {
      return colorConverter(color);
    }
    return color;
  }, [color]);

  const [hue, setHue] = useState<number>(hsvColor[0]);
  const [sat, setSat] = useState<number>(hsvColor[1]);
  const [val, setVal] = useState<number>(hsvColor[2]);

  const satValPickerRef = useRef<any>();

  const getCurrentColor = () => satValPickerRef.current?.getCurrentColor;

  useImperativeHandle(ref, () => ({
    getCurrentColor,
  }));

  useEffect(() => {
    onColorChange(satValPickerRef.current?.getCurrentColor());
  }, [hue, onColorChange, sat, val])

  const flexDirection = huePickerArrangement === 'horizontal' ? 'column' : 'row';

  function onSatValChange(satValPicker: {saturation: number; value: number}): void {
    setSat(satValPicker.saturation);
    setVal(satValPicker.value);
  }

  function onHueChange(hue: number): void {
    setHue(hue);
  }

return (
    <View style={[styles.container, {flexDirection}, containerStyle]}>
      <SaturationValuePicker
        containerStyle={satValPickerContainerStyle}
        borderRadius={satValPickerBorderRadius}
        height={satValPickerHeight}
        width={satValPickerWidth}
        sliderSize={satValPickerSliderSize}
        hue={hue}
        saturation={sat}
        value={val}
        onDragMove={onSatValChange}
        onPress={onSatValChange}
        ref={satValPickerRef}
      />
      <HuePicker
        arrangement={huePickerArrangement}
        containerStyle={huePickerContainerStyle}
        borderRadius={huePickerBorderRadius}
        hue={hue}
        barWidth={huePickerBarWidth}
        barHeight={huePickerBarHeight}
        sliderSize={huePickerSliderSize}
        onDragMove={onHueChange}
        onPress={onHueChange}
        borderColorized={huePickerBorderColorized}
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
