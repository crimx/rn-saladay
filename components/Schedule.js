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
import { View, StyleSheet, SectionList, Text } from 'react-native'
import { NavigationActions } from 'react-navigation'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import Expo from 'expo'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import autobind from 'autobind-decorator'
import { Button } from 'native-base'
import colors from '../style/colors'

const sectionHeaderHeight = 20
const sectionItemHeight = 45

@inject('scheduleStore')
@observer
export default class Schedule extends Component {
  @computed get _sections () {
    const {dates, schedules} = this.props.scheduleStore
    return dates.peek()
      .map(({date, title}) => ({
        data: schedules.get(date),
        title
      }))
  }

  _keyExtractor = ([item]) => item.schedule_date + item.schedule_index

  _getItemLayout = sectionListGetItemLayout({
    getItemHeight: () => sectionItemHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight
  })

  @autobind
  _renderSectionHeader ({section}) {
    return <Text style={styles.sectionHeader}>{section.title}</Text>
  }

  @autobind
  _renderItem ({item}) {
    const [itemLeft, itemRight] = item
    return (
      <View style={{flexDirection: 'row'}}>
        <Button transparent style={[styles.listItem, {backgroundColor: itemLeft.goal_color || undefined}]}>
          <Text style={styles.listItemText}>{itemLeft.goal_title}</Text>
        </Button>
        <Button transparent style={[styles.listItem, {backgroundColor: itemRight.goal_color || undefined}]}>
          <Text style={styles.listItemText}>{itemRight.goal_title}</Text>
        </Button>
      </View>
    )
  }

  render () {
    return (
      <SectionList
        stickySectionHeadersEnabled
        initialScrollIndex={25}
        initialNumToRender={15}
        getItemLayout={this._getItemLayout}
        sections={this._sections}
        keyExtractor={this._keyExtractor}
        renderSectionHeader={this._renderSectionHeader}
        renderItem={this._renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    height: sectionHeaderHeight,
    paddingLeft: 5,
    textAlignVertical: 'center',
    color: colors.greyDark,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  listItem: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.grey,
    borderWidth: 1,
    borderColor: '#fff'
  },
  listItemText: {
    color: '#fff',
  }
})