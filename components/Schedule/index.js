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
import { View, StyleSheet, SectionList, Text, TouchableNativeFeedback, Dimensions } from 'react-native'
import { Fab, Icon } from 'native-base'
import ScheduleItem from './ScheduleItem'
import ScheduleMenu from './ScheduleMenu'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import { observable, action, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import autobind from 'autobind-decorator'
import colors from '../../style/colors'

const { width: deviceWidth } = Dimensions.get('window')
const sectionHeaderHeight = 40
const sectionItemHeight = 45
const sectionHeight = sectionHeaderHeight + sectionItemHeight * 24

class SectionRow extends Component {
  shouldComponentUpdate (nextProps) {
    const [left, right] = this.props.row
    const [nextLeft, nextRight] = nextProps.row
    return left !== nextLeft || right !== nextRight
  }
  render () {
    const {row, index} = this.props
    return (
      <View style={styles.listRow}>
        <Text style={styles.listRowTime}>{`${index}:00`}</Text>
        <ScheduleItem item={row[0]} />
        <ScheduleItem item={row[1]} />
      </View>
    )
  }
}

@inject('scheduleStore')
class SectionHeader extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.section.title !== nextProps.section.title
  }

  render () {
    return (
      <TouchableNativeFeedback
        onPress={this.props.scheduleStore.clearSelection}
        background={TouchableNativeFeedback.Ripple(colors.primaryLight)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{this.props.section.title}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

@observer
class BackToToday extends Component {
  render () {
    const {direction, onPress} = this.props
    if (!direction) { return null }

    return (
      <Fab active
        style={styles.fab}
        position='bottomRight'
        onPress={onPress}
      >
        <Icon name={`ios-arrow-${direction}`} />
      </Fab>
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

  _renderSectionHeader = ({ section }) => <SectionHeader section={section} />

  _renderItem = ({ item }) => <SectionRow row={item.data} index={item.index} />

  @observable _refreshing = false
  @observable _todayOutOfSightDirection = false

  // coordinate of today section
  @computed get _todayY () {
    return this.props.scheduleStore.todaySectionIndex * sectionHeight
  }

  @action.bound
  _onRefresh () {
    this._refreshing = true
    this.props.scheduleStore.addNextDate()
      .then(action(() => (this._refreshing = false)))
  }

  @autobind
  _onEndReached () {
    this.props.scheduleStore.addPrevDate()
  }

  @autobind
  _backToToday () {
    this.refs.listRef.scrollToLocation({
      sectionIndex: this.props.scheduleStore.todaySectionIndex,
      itemIndex: 0,
      viewOffset: sectionHeaderHeight
    })
  }

  _scrollTimeout = null

  @autobind
  _onScroll ({nativeEvent}) {
    clearTimeout(this._scrollTimeout)
    this._scrollTimeout = setTimeout(() => {
      this._setTodayOutOfSightDirection(nativeEvent.contentOffset.y)
    }, 15)
  }

  @action.bound
  _setTodayOutOfSightDirection (y) {
    const offset = this._todayY - y
    if (offset > sectionHeight) {
      this._todayOutOfSightDirection = 'down'
    } else if (offset < -sectionHeight) {
      this._todayOutOfSightDirection = 'up'
    } else {
      this._todayOutOfSightDirection = false
    }
  }

  render () {
    return (
      <View>
        <SectionList
          ref='listRef'
          stickySectionHeadersEnabled
          initialScrollIndex={25}
          initialNumToRender={15}
          getItemLayout={this._getItemLayout}
          sections={this.props.scheduleStore.sections.slice()}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshing={this._refreshing}
          onRefresh={this._onRefresh}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={1}
          onScroll={this._onScroll}
        />
        <ScheduleMenu />
        <BackToToday
          direction={this.props.scheduleStore.isSelectedSchedulesEmpty && this._todayOutOfSightDirection}
          onPress={this._backToToday} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    width: deviceWidth,
    height: sectionHeaderHeight,
    paddingLeft: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  sectionHeaderText: {
    height: sectionHeaderHeight,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.greyDark,
  },
  listRow: {
    flexDirection: 'row',
    width: deviceWidth,
    height: sectionItemHeight
  },
  listRowTime: {
    width: 45,
    height: sectionItemHeight,
    paddingRight: 5,
    textAlign: 'right',
    color: colors.greyDark
  },
  fab: {
    backgroundColor: colors.primary
  }
})
