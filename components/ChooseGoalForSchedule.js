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
import { View, StyleSheet, Text, SectionList, TouchableNativeFeedback } from 'react-native'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import Expo from 'expo'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import { NavigationActions } from 'react-navigation'
import colors from '../style/colors'
import {
  Body, Button, Container, Content,
  Header, Icon, Left, Spinner, Title
} from 'native-base'

const sectionHeaderHeight = 35
const sectionItemHeight = 45

class SectionHeader extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.section.title !== nextProps.section.title
  }

  render () {
    return (
      <Text style={styles.sectionHeaderText}>{this.props.section.title}</Text>
    )
  }
}

@inject('scheduleStore', 'navigationStore')
@observer
class SectionItem extends Component {
  _onPress = () => {
    const {scheduleStore, navigationStore, item} = this.props
    scheduleStore.setSelectionSchedule(item)
    navigationStore.dispatchNavigation(NavigationActions.back())
  }

  render () {
    const {item} = this.props
    return (
      <TouchableNativeFeedback
        useForeground
        onPress={this._onPress}
        background={TouchableNativeFeedback.Ripple(item.goal_color)}
      >
        <View style={styles.sectionItem}>
          <Text style={styles.sectionItemText}>{item.goal_title}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

class ItemSeparatorComponent extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return <View style={styles.separator} />
  }
}

@inject('goalStore')
@observer
export default class ChooseGoalForSchedule extends Component {
  @computed get _sections () {
    const {goalLists, goalUndoneItems} = this.props.goalStore
    return goalLists
      .map(({list_id: key, list_title: title}) => ({
        key,
        title,
        data: goalUndoneItems.get(key).map(item => ({key: item.goal_date, data: item}))
      }))
      .filter(({data}) => data.length > 0)
  }

  _goBack = () => {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  _getItemLayout = sectionListGetItemLayout({
    getItemHeight: () => sectionItemHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight
  })

  _renderSectionHeader = ({section}) => <SectionHeader section={section} />

  _renderItem = ({item}) => <SectionItem item={item.data} />

  render () {
    return (
      <View style={{flex: 1, backgroundColor: colors.primary}}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: colors.primary}}>
            <Left>
              <Button transparent onPress={this._goBack}>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Choose Goal</Title>
            </Body>
          </Header>
          <Content>
            <SectionList
              initialNumToRender={15}
              ListEmptyComponent={<Spinner color={colors.primary} />}
              getItemLayout={this._getItemLayout}
              sections={this._sections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderItem}
              ItemSeparatorComponent={ItemSeparatorComponent}
            />
          </Content>
        </Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212021',
    marginTop: Expo.Constants.statusBarHeight
  },
  separator: {
    height: 1,
    backgroundColor: colors.greyLight
  },
  sectionHeaderText: {
    height: sectionHeaderHeight,
    paddingLeft: 10,
    fontSize: 18,
    textAlignVertical: 'center',
    color: colors.greyDark,
    backgroundColor: colors.greyLight,
  },
  sectionItem: {
    height: sectionItemHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  sectionItemText: {
    fontSize: 18,
    color: colors.greyDark
  }
})
