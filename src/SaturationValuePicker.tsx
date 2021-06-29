import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ViewStyle,
  PanResponder,
  StyleSheet,
  StyleProp,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import chroma from 'chroma-js';
import normalizeValue from './utils';

interface Props {
  containerStyle: StyleProp<ViewStyle>;
  borderRadius?: number;
  width?: number;
  height?: number;
  sliderSize?: number;
  hue: number;
  saturation: number;
  value: number;
  onDragStart: (satValPicker: {saturation: number; value: number}) => void;
  onDragMove: (satValPicker: {saturation: number; value: number}) => void;
  onDragEnd: (satValPicker: {saturation: number; value: number}) => void;
  onDragTerminate: (satValPicker: {saturation: number; value: number}) => void;
  onPress: (satValPicker: {saturation: number; value: number}) => void;
}

interface DragStartState {
  saturation: number;
  value: number;
}

type ReturnType = React.FunctionComponentElement<React.ForwardRefRenderFunction<any, Props>>;
// SaturationValuePicker.defaultProps = {
  //   containerStyle: {},
  //   borderRadius: 0,
  //   size: 200,
  //   sliderSize: 24,
  //   hue: 0,
  //   saturation: 1,
  //   value: 1,
  //   onDragStart: null,
  //   onDragMove: null,
  //   onDragEnd: null,
  //   onDragTerminate: null,
  //   onPress: null,
  // };
function SaturationValuePicker(
  {
    width = 200,
    height = 120,
    saturation = 1,
    value = 1,
    containerStyle,
    borderRadius = 0,
    sliderSize = 24,
    hue = 0,
    onDragEnd,
    onDragStart,
    onDragMove,
    onDragTerminate,
    onPress,
  }: Props,
  ref: React.Ref<any>,
): ReturnType {
  // eslint-disable-next-line no-unused-vars
  const [dragStartValue, setDragStartValue] = useState<DragStartState>({
    saturation: saturation,
    value: value,
  });

  function computeSatValDrag(gestureState: {dx: number; dy: number}) {
    const {dx, dy} = gestureState;
    const {saturation, value} = dragStartValue;
    const diffx = dx / width;
    const diffy = dy / height;
    const updatedSatVal = {
      saturation: normalizeValue(saturation + diffx),
      value: normalizeValue(value - diffy),
    }
    setDragStartValue(updatedSatVal)
    return updatedSatVal;
  }

  function fireDragEvent(eventName: any, gestureState: {dx: number; dy: number}) {
    if (eventName) {
      eventName({
        ...computeSatValDrag(gestureState),
        gestureState,
      });
    }
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      fireDragEvent(onDragStart, gestureState);
    },
    onPanResponderMove: (evt, gestureState) => {
      fireDragEvent(onDragMove, gestureState);
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      fireDragEvent(onDragEnd, gestureState);
    },
    onPanResponderTerminate: (evt, gestureState) => {
      fireDragEvent(onDragTerminate, gestureState);
    },
    onShouldBlockNativeResponder: () => true,
  });

  function getCurrentColor() {
    return chroma.hsv(hue, saturation, value).hex();
  }

  useImperativeHandle(ref, () => ({
    getCurrentColor,
  }));

  function computeSatValPress(event: any) {
    const {nativeEvent} = event;
    const {locationX, locationY} = nativeEvent;
    return {
      saturation: normalizeValue(locationX / width),
      value: 1 - normalizeValue(locationY / height),
    };
  }

  function firePressEvent(event: any) {
    if (onPress) {
      onPress({
        ...computeSatValPress(event),
      });
    }
  }

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          height: height + sliderSize,
          width: width + sliderSize,
        },
      ]}
    >
      <TouchableWithoutFeedback onPress={firePressEvent}>
        <LinearGradient
          style={[{borderRadius}, styles.linearGradient]}
          colors={['#fff', chroma.hsl(hue, 1, 0.5).hex()]}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
        >
          <LinearGradient colors={['rgba(0, 0, 0, 0)', '#000']}>
            <View
              style={{
                height: height,
                width: width,
              }}
            />
          </LinearGradient>
        </LinearGradient>
      </TouchableWithoutFeedback>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            width: sliderSize,
            height: sliderSize,
            borderRadius: sliderSize / 2,
            borderWidth: sliderSize / 10,
            backgroundColor: getCurrentColor(),
            transform: [{translateX: width * saturation}, {translateY: height * (1 - value)}],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    top: 0,
    left: 0,
    position: 'absolute',
    borderColor: '#fff',
  },
  linearGradient: {
    overflow: 'hidden',
  },
});

export default forwardRef(SaturationValuePicker);
