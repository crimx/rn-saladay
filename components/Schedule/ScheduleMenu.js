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
import { View, StyleSheet, TouchableNativeFeedback, FlatList, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'

/**
 * Counts the total selection. Make it another component so that
 * the Menu won't have to rerender every time selection changes.
 */
@inject('scheduleStore')
@observer
class SelectCount extends Component {
  render () {
    return (
      <View style={styles.selectCount}>
        <MaterialCommunityIcons name='chevron-down' color='#fff' size={20} />
        <Text style={styles.selectCountText}>{
          (this.props.scheduleStore.selectedSchedules.size / 2).toFixed(1)
        } h</Text>
      </View>
    )
  }
}

class MenuButton extends Component {
  render () {
    return (
      <View style={[styles.menuButtonWrap, this.props.style]}>
        <TouchableNativeFeedback
          onPress={this.props.onPress}
          background={TouchableNativeFeedback.Ripple('#fff', true)}
        >
          <View style={styles.menuButton}>
            {this.props.children}
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

@inject('scheduleStore', 'navigationStore')
@observer
export default class ScheduleMenu extends Component {
  constructor (...args) {
    super(...args)

    const {
      removeSelectionSchedule,
      moveSelectionUpwards,
      moveSelectionDownwards,
      clearSelection
    } = this.props.scheduleStore

    this.listData = [
      <MenuButton onPress={this._chooseGoal}>
        <MaterialCommunityIcons name='plus' color='#fff' size={20} />
      </MenuButton>,
      <MenuButton onPress={removeSelectionSchedule}>
        <MaterialCommunityIcons name='minus' color='#fff' size={20} />
      </MenuButton>,
      <MenuButton onPress={moveSelectionUpwards}>
        <MaterialCommunityIcons name='menu-up' color='#fff' size={35} style={{paddingBottom: 2}} />
      </MenuButton>,
      <MenuButton onPress={moveSelectionDownwards}>
        <MaterialCommunityIcons name='menu-down' color='#fff' size={35} />
      </MenuButton>,
      <MenuButton onPress={clearSelection} style={{width: 55}}>
        <SelectCount />
      </MenuButton>
    ]
  }

  _chooseGoal = () => {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'ChooseGoalForSchedule'
      })
    )
  }

  _keyExtractor = (item, index) => index

  _renderItem = ({item}) => item

  render () {
    if (this.props.scheduleStore.isSelectedSchedulesEmpty) {
      return null
    }
    return (
      <View style={styles.menuWrap}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.listData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: 'rgba(34, 49, 63, 0.7)'
  },
  menuButtonWrap: {
    width: 40,
    height: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5
  },
  menuButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButtonText: {
    fontSize: 14,
    color: '#fff'
  },
  selectCount: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectCountText: {
    paddingBottom: 2,
    marginRight: 4,
    color: '#fff'
  }
})
