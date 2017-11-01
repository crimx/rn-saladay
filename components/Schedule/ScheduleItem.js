/*
 * This file is part of Saladay <https://www.crimx.com/rn-saladay/>.
 * Copyright (C) 2017 CRIMX <straybugs@gmail.com>
 *
 * Saladay is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Saladay is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Saladay.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { computed, observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import autobind from 'autobind-decorator'
import colors from '../../style/colors'

@inject('scheduleStore')
@observer
export default class ScheduleItem extends Component {
  _onPress = () => this.props.scheduleStore.toggleItemSelection(this.props.item)

  render () {
    const schedule = this.props.scheduleStore.schedules.get(this.props.item)
    return (
      <TouchableWithoutFeedback useForeground onPress={this._onPress}>
        <View style={styles.listItemWrap}>
          <View style={[styles.listItem, { backgroundColor: schedule.goal_color }]}>
            <Text style={styles.listItemText}>{schedule.goal_title}</Text>
          </View>
          {schedule.isSelected && <View style={styles.listItemMask} />}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  listItemWrap: {
    flex: 1
  },
  listItemMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(54, 215, 183, 0.5)'
  },
  listItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#fff'
  },
  listItemText: {
    color: '#fff',
  }
})
