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

import React, { Component, PureComponent } from 'react'
import { View, StyleSheet, SectionList, Text, TouchableNativeFeedback, Dimensions } from 'react-native'
import { NavigationActions } from 'react-navigation'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import Expo from 'expo'
import { computed, observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import autobind from 'autobind-decorator'
import colors from '../style/colors'

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window')
const halfDeviceWidth = deviceWidth / 2
const sectionHeaderHeight = 40
const sectionItemHeight = 45

@observer
class TimeButton extends Component {
  render () {
    return (
      <TouchableNativeFeedback
        onPress={this.props.onPress}
        background={TouchableNativeFeedback.Ripple('#fff')}
      >
        <View style={styles.listItemWrap}>
          <View style={[styles.listItem, {backgroundColor: this.props.item.goal_color || colors.grey}]}>
            <Text style={styles.listItemText}>{this.props.item.goal_title}</Text>
          </View>
          {this.props.isSelected && <View style={styles.listItemMask} />}
        </View>
      </TouchableNativeFeedback>
    )
  }
}

@observer
class SectionRow extends Component {
  render () {
    return (
      <View style={styles.listRow}>
        <TimeButton item={this.props.row[0]} />
        <TimeButton item={this.props.row[1]} />
      </View>
    )
  }
}

class SectionHeader extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.section.title !== nextProps.section.title
  }
  render () {
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderRadius} />
        <Text style={styles.sectionHeaderText}>{this.props.section.title}</Text>
      </View>
    )
  }
}

@inject('scheduleStore')
@observer
export default class Schedule extends Component {
  _getItemLayout = sectionListGetItemLayout({
    getItemHeight: () => sectionItemHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight
  })

  _renderSectionHeader = ({section}) => <SectionHeader section={section} />

  _renderItem = ({item}) => <SectionRow row={item.data} />

  @observable refreshing = false

  @action.bound
  _onRefresh () {
    this.refreshing = true
    this.props.scheduleStore.addNextDate()
      .then(action(() => (this.refreshing = false)))
  }

  @autobind
  _onEndReached () {
    this.props.scheduleStore.addPrevDate()
  }

  render () {
    return (
      <SectionList
        inverted
        stickySectionHeadersEnabled
        initialScrollIndex={25}
        initialNumToRender={15}
        getItemLayout={this._getItemLayout}
        sections={[...this.props.scheduleStore.schedules]}
        renderSectionHeader={this._renderSectionHeader}
        renderItem={this._renderItem}
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        refreshing={this.refreshing}
        onRefresh={this._onRefresh}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={1}
      />
    )
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    overflow: 'hidden',
    width: deviceWidth,
    height: sectionHeaderHeight - 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 4,
    borderColor: colors.primary
  },
  sectionHeaderRadius: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: deviceWidth + 8,
    height: sectionHeaderHeight + 15,
    borderWidth: 4,
    borderRadius: 12,
    borderColor: colors.primary
  },
  sectionHeaderText: {
    fontSize: 16,
    color: colors.greyDark,
  },
  listRow: {
    flexDirection: 'row',
  },
  listItemWrap: {
    width: halfDeviceWidth,
    height: sectionItemHeight,
  },
  listItemMask: {
    position: 'absolute',
    width: halfDeviceWidth,
    height: sectionItemHeight,
    backgroundColor: 'rgba(54, 215, 183, 0.5)'
  },
  listItem: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: halfDeviceWidth,
    height: sectionItemHeight - 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff'
  },
  listItemText: {
    color: '#fff',
  }
})
