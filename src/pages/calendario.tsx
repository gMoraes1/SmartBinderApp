import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { DayState } from 'react-native-calendars/src/types';
import { Feather, Ionicons } from "@expo/vector-icons";

import { ptBR } from '../utils/localecalendarConfig';

LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

export default function Calendars() {

  const [day, setDay] = useState<DateData>()
  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        headerStyle={{
          borderBottomWidth: 2,
          paddingBottom: 10,
          marginBottom: 10,
        }}



        theme={{
          textMonthFontWeight: '700',
          textMonthFontSize: 22,
          textDayFontSize: 16,
          textDayFontWeight: '800',
          todayTextColor: '#6636E6',
          selectedDayBackgroundColor: '#6939E9',
          selectedDayTextColor: 'white',
          calendarBackground: 'transparent',
          arrowColor: '#6636E6',
          textDisabledColor: 'rgba(105,57,233,0.3)',
          textDayHeaderFontWeight: '900',
          textDayHeaderFontSize: 13
        }}

        minDate={new Date().toDateString()}

        hideExtraDays={true}

        onDayPress={setDay}

        renderArrow={(direction: "right" | "left") => <Feather size={38} name={`chevron-${direction}`} color={"#6939E9"} />}

        markedDates={day && {
          [day.dateString]: { selected: true }
        }
        }

        dayComponent={({ date, state }: { date: DateData, state: DayState }) => {
          return (
            <TouchableOpacity style={[
              styles.day,
              date.dateString === day?.dateString && styles.selected
            ]}
            onPress={() => setDay(date)}
            >

              <Text style={[
                styles.dayText,
                (state === 'inactive' || state === "disabled") && styles.disabledDayText,
                state === "today" && styles.today,
                date.dateString === day?.dateString && styles.selected
              ]}>
                {date.day}
              </Text>


            </TouchableOpacity>
          )
        }}
        />

        <Text style={styles.title}>{day.dateString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 18,
  },

  calendar: {
    borderWidth: 0.5,
    borderBottomWidth: 0.8,
    padding: 13,
    margin: 10,
    top: 45,
    backgroundColor: 'transparent',
  },

  dayText: {
    fontWeight: '600',
    fontSize: 18,
  },
  
  disabledDayText: {
    fontWeight: '600',
    fontSize: 18,
    color: 'rgba(105,57,233,0.3)',
  },
  
  day: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:13,
  },
  
  today: {
    fontWeight: '800',
    fontSize: 17,
    color: '#6636E6',
  },
  
  selected: {
    color:'#fff',
    backgroundColor: '#6939E9',
  },
});