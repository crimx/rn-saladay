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
import { View, StyleSheet, SectionList, Text, RefreshControl } from 'react-native'
import { NavigationActions } from 'react-navigation'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import Expo from 'expo'
import { computed, observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import autobind from 'autobind-decorator'
import { Button } from 'native-base'
import colors from '../style/colors'

const sectionHeaderHeight = 20
const sectionItemHeight = 45

class SectionItem extends PureComponent {
  render () {
    const [itemLeft, itemRight] = this.props.item
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
}

class SectionHeader extends PureComponent {
  render () {
    return <Text style={styles.sectionHeader}>{this.props.section.title}</Text>
  }
}

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

  _renderSectionHeader = ({section}) => <SectionHeader section={section} />

  _renderItem = ({item}) => <SectionItem item={item} />

  @observable refreshing = false

  @action.bound
  _onRefresh () {
    this.refreshing = true
    this.props.scheduleStore.prependDate()
      .then(action(() => (this.refreshing = false)))
  }

  @autobind
  _onEndReached () {
    this.props.scheduleStore.appendDate()
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
