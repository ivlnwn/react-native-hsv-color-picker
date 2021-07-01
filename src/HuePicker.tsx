import React, {useState, useEffect, useMemo} from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  PanResponder,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import chroma from 'chroma-js';
import normalizeValue from './utils';

interface Props {
  arrangement: 'horizontal' | 'vertical';
  containerStyle: StyleProp<ViewStyle>;
  borderRadius?: number;
  hue: number;
  barWidth?: number;
  barHeight?: number;
  sliderSize?: number;
  onDragStart: (huePicker: {hue: number}) => void;
  onDragMove: (huePicker: {hue: number}) => void;
  onDragEnd: (huePicker: {hue: number}) => void;
  onDragTerminate: (huePicker: {hue: number}) => void;
  onPress: (huePicker: {hue: number}) => void;
}

const hueColors: string[] = [
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ff0000',
];

export default function HuePicker({
  arrangement = 'vertical',
  containerStyle,
  borderRadius = 0,
  hue = 0,
  barWidth = 12,
  barHeight = 200,
  sliderSize = 24,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDragTerminate,
  onPress,
}: Props): React.FunctionComponentElement<Props> {
  const [dragStartValue, setDragStartValue] = useState<number>(hue);

  const longSide = arrangement === 'horizontal' ? barWidth : barHeight;
  const shortSide = arrangement === 'horizontal' ? barHeight : barWidth;

  const arrangementProps = useMemo(() => {
    if (arrangement === 'horizontal') {
      return {
        containerIndentsStyle: {
          paddingHorizontal: sliderSize / 2,
          paddingVertical: sliderSize - shortSide > 0 ? (sliderSize - shortSide) / 2 : 0,
        },
        gradientEnd: {x: 1, y: 0},
        gesturePressLocation: 'locationX',
        gestureDragCoordinates: 'dx',
      };
    }
    return {
      containerIndentsStyle: {
        paddingVertical: sliderSize / 2,
        paddingHorizontal: sliderSize - shortSide > 0 ? (sliderSize - shortSide) / 2 : 0,
      },
      gradientEnd: {x: 0, y: 1},
      gesturePressLocation: 'locationY',
      gestureDragCoordinates: 'dy',
    };
  }, []);

  const slider = new Animated.Value((longSide * hue) / 360);
  const translate = arrangement === 'horizontal' ? {translateX: slider} : {translateY: slider};

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

  useEffect(() => {
    slider.setValue((longSide * hue) / 360);
  }, [hue, barHeight, barWidth]);

  function getCurrentColor() {
    return chroma.hsl(hue, 1, 0.5).hex();
  }

  function computeHueValueDrag(gestureState: any) {
    const gestureCoordinates = gestureState[arrangementProps.gestureDragCoordinates];
    const diff = gestureCoordinates / longSide;
    const updatedHue = normalizeValue(dragStartValue / 360 + diff) * 360;
    setDragStartValue(updatedHue);
    return updatedHue;
  }

  function computeHueValuePress(event: {nativeEvent: any}) {
    const {nativeEvent} = event;
    const location = nativeEvent[arrangementProps.gesturePressLocation];
    const updatedHue = normalizeValue(location / longSide) * 360;
    setDragStartValue(updatedHue);
    return updatedHue;
  }

  function fireDragEvent(eventName: any, gestureState: any) {
    if (eventName) {
      eventName({
        hue: computeHueValueDrag(gestureState),
        gestureState,
      });
    }
  }

  function firePressEvent(event: {nativeEvent: any}) {
    if (onPress) {
      onPress({
        hue: computeHueValuePress(event),
      });
    }
  }

  return (
    <View style={[styles.container, arrangementProps.containerIndentsStyle, containerStyle]}>
      <TouchableWithoutFeedback onPress={firePressEvent}>
        <LinearGradient
          colors={hueColors}
          style={{
            borderRadius,
          }}
          start={{x: 0, y: 0}}
          end={arrangementProps.gradientEnd}
        >
          <View
            style={{
              width: barWidth,
              height: barHeight,
            }}
          />
        </LinearGradient>
      </TouchableWithoutFeedback>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            width: sliderSize,
            height: sliderSize,
            borderRadius: sliderSize / 2,
            borderWidth: sliderSize / 10,
            backgroundColor: getCurrentColor(),
            transform: [translate],
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
});
