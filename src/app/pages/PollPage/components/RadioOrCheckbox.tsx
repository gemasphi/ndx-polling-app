import * as React from 'react';
import { Radio, Checkbox, Row, FormInstance } from 'antd';

interface Props {
  multipleChoice: boolean;
  options: Array<string>;
  form: FormInstance<any>;
  started: boolean
}

const RadioOrCheckbox = ({multipleChoice, options, form, started}: Props) => {
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
					<Row key={i}>
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