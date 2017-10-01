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
import MultilineInput from './MultilineInput'

export default class AutoExpandInput extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      height: 0
    }
  }

  componentWillReceiveProps (props) {
    if (!props.value) {
      this.setState({height: 130})
    }
  }

  _onContentSizeChange (event) {
    this.setState({height: event.nativeEvent.contentSize.height})
    this.props.onContentSizeChange && this.props.onContentSizeChange(event)
  }

  render () {
    const {
      onContentSizeChange,
      style = {},
      ...otherProps,
    } = this.props

    return (
      <MultilineInput
        {...otherProps}
        onContentSizeChange={this._onContentSizeChange.bind(this)}
        style={[{height: this.state.height + 30}, style]}
      />
    )
  }
}
