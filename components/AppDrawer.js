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
import { View, StyleSheet, Image, Alert } from 'react-native'
import Expo from 'expo'
import { Container, Content, List, ListItem, Text, Icon, Left, Body, Toast } from 'native-base'
import { inject } from 'mobx-react'
import Dao from '../dao'
import colors from '../style/colors'

@inject('goalStore', 'scheduleStore')
export default class AppDrawer extends Component {
  _backup = () => {
    Alert.alert(
      'Backup Database',
      `Just copy the db file at\n\n` +
      `${Expo.FileSystem.documentDirectory}SQLite/saladay.db`,
      [
        {text: 'ok'},
      ]
    )
  }

  _replace = () => {
    Alert.alert(
      'Replace Database',
      `Replace the db file at\n\n` +
      `${Expo.FileSystem.documentDirectory}SQLite/saladay.db`,
      [
        {text: 'ok'},
      ]
    )
  }

  _reset = () => {
    Alert.alert(
      'Danger',
      `This action CANNOT be undone. This will permanently reset the database.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => new Dao().reset()
            .then(() => {
              this.props.scheduleStore.reset()
              this.props.goalStore.reset()
            })
            .then(() => {
              Toast.show({
                text: `Database deleted`,
                buttonText: 'OK',
                duration: 2000
              })
            })
            .catch(err => {
              Toast.show({
                text: `Cannot delete database`,
                type: 'danger',
                duration: 2000
              })
              __DEV__ && console.error(err)
            })
        }
      ]
    )
  }

  _viewSource = () => {
    Expo.WebBrowser.openBrowserAsync('https://github.com/crimx/rn-saladay')
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <View>
            <Text style={styles.appName}>Saladay</Text>
            <Text style={styles.intro}>Getting Big Things Done</Text>
          </View>
        </View>
        <Container>
          <Content>
            <List>
              <ListItem first icon button onPress={this._backup}>
                <Left>
                  <Icon name='ios-archive-outline' />
                </Left>
                <Body>
                  <Text>Backup Database</Text>
                </Body>
              </ListItem>
              <ListItem icon button onPress={this._replace}>
                <Left>
                  <Icon name='ios-copy-outline' />
                </Left>
                <Body>
                  <Text>Replace Database</Text>
                </Body>
              </ListItem>
              <ListItem icon button onPress={this._reset}>
                <Left>
                  <Icon name='md-refresh-circle' style={styles.btnReset} />
                </Left>
                <Body>
                  <Text>Reset Database</Text>
                </Body>
              </ListItem>
              <ListItem last icon button onPress={this._viewSource}>
                <Left>
                  <Icon name='logo-github' />
                </Left>
                <Body>
                  <Text>View Source</Text>
                </Body>
              </ListItem>
            </List>
          </Content>
        </Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff'
  },
  header: {
    width: '100%',
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary
  },
  logo: {
    width: 55,
    height: 55,
    marginTop: 3,
    marginRight: 3
  },
  appName: {
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 35,
    color: '#fff'
  },
  intro: {
    textAlign: 'center',
    fontSize: 11,
    color: '#fff'
  },
  btnReset: {
    color: '#d91e18'
  }
})
