import * as React from 'react';
import { Typography, Form, Input, Button, Radio, Select, Checkbox, Col, Row } from 'antd';

const RadioOrCheckbox = ({multipleChoice, options, form, started}) => {
	const Group = multipleChoice ? Checkbox.Group : Radio.Group
	const Option = multipleChoice ? Checkbox : Radio

	const onChange = (e) => {
		const value = multipleChoice ? e : [e.target.value]
		form.setFieldsValue({vote: value})
	}

	return (
		<Group onChange={onChange}>
			{
				options.map((option, i) => (
					<Row>
						<Option value={i} style={{ lineHeight: '32px' }} disabled={!started}>
							{option}
						</Option>
					</Row>
				))
		  	}
		</Group>
	)
}

export default RadioOrCheckbox;