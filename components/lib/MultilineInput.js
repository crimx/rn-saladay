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

import React, {PureComponent} from 'react'
import {Input} from 'native-base'

export default class MultilineInput extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selection: {start: 0, end: 0},
      value: this.props.value || ''
    }
    this.lastOnSubmitEditing = 0

    this._bindOnSelectionChange = this._onSelectionChange.bind(this)
    this._bindOnChangeText = this._onChangeText.bind(this)
    this._bindOnSubmitEditing = this._onSubmitEditing.bind(this)
  }

  _onSubmitEditing () {
    const time = Date.now()
    // Prevent 2 newlines for some Android versions, because they dispatch onSubmitEditing twice
    if (time - this.lastOnSubmitEditing < 200) { return }
    this.lastOnSubmitEditing = time

    const {selection} = this.state
    const {value} = this.state
    const newText = `${value.slice(0, selection.start)}\n${value.slice(selection.end)}`
    // move cursor only for this case, because in other cases a change of the selection is not allowed by Android
    if (selection.start !== value.length && selection.start === selection.end) {
      this.setState({
        selection: {
          start: selection.start + 1,
          end: selection.end + 1,
        },
      })
    }
    this._onChangeText(newText)
  }

  _onChangeText (value) {
    this.setState({ value })
    this.props.onChangeText && this.props.onChangeText(value)
  }

  _onSelectionChange (event) {
    this.setState({selection: event.nativeEvent.selection})
    this.props.onSelectionChange && this.props.onSelectionChange(event)
  }

  render () {
    const {
      multiline,
      blurOnSubmit,
      selection,
      value,
      onSelectionChange,
      onChangeText,
      onSubmitEditing,
      ...otherProps
    } = this.props
    return (
      <Input
        {...otherProps}
        multiline
        blurOnSubmit={false}
        selection={this.state.selection}
        value={this.state.value}
        onSelectionChange={this._bindOnSelectionChange}
        onChangeText={this._bindOnChangeText}
        onSubmitEditing={this._bindOnSubmitEditing}
      />
    )
  }
}
