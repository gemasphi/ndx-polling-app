import React, {useState, useEffect} from 'react';
import { Typography, Switch, Grid, DatePicker, Form, Input, Button, Select, Checkbox, Col, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { usePollsSlice } from 'features/polls';
import { selectLoading } from 'features/polls/selectors';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;
const { Text } = Typography;
const { Option } = Select;

const StyledSelect = styled(Select)`
	width: 175px !important;

  	.ant-select-selector {
    	padding-left: 0.3em !important;
  	}
`;

const StyledDatePicker =  styled(props => <DatePicker {...props}/>)`
    width: 100%;
`

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 16 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 10, offset: 0 },
    sm: { span: 16, offset: 0 },
  },
};

enum StartingType {
  DATE = "date",
  BN = "block number",
  AUTO = "auto"
}


export function CreationForm() {
	const maxOptions = 20;
	const { actions } = usePollsSlice();
	const dispatch = useDispatch();
	const loading = useSelector(selectLoading);
	const screens = useBreakpoint();
  	const { t } = useTranslation();

  	const [startingType, setStartingType] = useState<StartingType>(StartingType.DATE);

	const onFinish = values => {
		let {dates , ...poll} = values; 
		let extra;

		if (startingType == StartingType.DATE){
			extra = {
				"startDate": dates[0].utc().format(),
				"endDate": dates[1].utc().format(),
				"blockNumber": null
			}
		} else if (startingType == StartingType.BN){
			extra = {
				"startDate": null,
				"endDate": poll.endDate.utc().format()
			}
		}else if (startingType == StartingType.AUTO){
			extra = {
				"blockNumber": null,
				"startDate": null,
				"endDate": poll.endDate.utc().format()
			}
		}

		poll = {
			...poll,
			"options": poll.options.filter(option => option !== undefined),
			...extra
		}

		dispatch(actions.createPoll(poll));
  	};

	const onOptionChange = (event, add, index, fieldsLength) => {
		if (event.target.value.length == 1 && (index + 1 == fieldsLength) && (fieldsLength < maxOptions)){
			add()
		}
	};

	const onSelect = (v) => {
		setStartingType(v)
	}


	return (
	 <Form name="dynamic_form_item" onFinish={onFinish}>
	    <Divider orientation="left" style={{marginTop:0}} >General Info</Divider>
        <Form.Item          
        	rules={[{ required: true, message:  t(...messages.titleRule()) }]}
			name="title"
		>
			<Input 
				style={{ width: '95%' }} 
				placeholder={t(...messages.titlePlaceholder())}
			/>
        </Form.Item>
		<Form.Item 
			name="description"
			style={{margin: "0 0 1em 0"}}
		>
			<Input.TextArea 
				maxLength={400} 
				autoSize={true}  
				style={{ width: '95%'}}
				placeholder={t(...messages.descriptionPlaceholder())}
			/>         
		</Form.Item>
		
		<Form.Item style={{margin: "0 0 1em 0"}}> 
			<Text style={{ lineHeight: "2.5"}}>
			I want to specify the starting date using
			</Text>
			<StyledSelect 
				onSelect={onSelect} 
				defaultValue={StartingType.DATE} 
				bordered={false}
			>
	      		<Option value={StartingType.BN}>a block number</Option>
	      		<Option value={StartingType.DATE}>a date</Option>
	      		<Option value={StartingType.AUTO}>the latest ETH block</Option>
	    	</StyledSelect>
		</Form.Item>

		{(startingType == StartingType.BN) && (<>
				<Form.Item
					rules={[{ required: true, message:  t(...messages.blockNumberRule()) }]}
					name="blockNumber"
				>
					<Input 
						style={{ width: '95%'}} 
						placeholder={t(...messages.blockNumberPlaceholder())}
					/>
		        </Form.Item>
				<Form.Item
		        	name="endDate"
					style={{ width: '95%', marginBottom: 10  }}
					rules={[{ required: true, message: t(...messages.endDateRule()) }]}
				>        
					<StyledDatePicker 
						placeholder="End Date" 
						showTime={{ format: 'HH:mm' }} 
						format="YYYY-MM-DD HH:mm" 
					/>
				</Form.Item>
	        </>
		)}

		{(startingType == StartingType.DATE) && (
			<Form.Item
        		name="dates"
				style={{ width: '95%', marginBottom: 10  }}
				rules={[{ required: true, message: t(...messages.datesRule()) }]}
        	>        
				<RangePicker
			  		style={{ width: '100%' }}
		      		showTime={{ format: 'HH:mm' }}
		      		format="YYYY-MM-DD HH:mm"
	    		/>
			</Form.Item>
		)}

	
		{(startingType == StartingType.AUTO) && (
			<Form.Item
	        	name="endDate"
				style={{ width: '95%', marginBottom: 10  }}
				rules={[{ required: true, message: t(...messages.endDateRule()) }]}
			>        
				<StyledDatePicker 
					placeholder="End Date" 
					showTime={{ format: 'HH:mm' }} 
					format="YYYY-MM-DD HH:mm" 
				/>
			</Form.Item>
		)}


        <Divider orientation="left">{t(...messages.options())}</Divider>
		<Form.List
			name="options"
			rules={[
			  {
			    validator: async (_, options) => {
			      let all_filled = options.every(name => (name && name.length > 0));
			      if (!options || options.length < 2 || (options.length == 2 && !all_filled)) {
			        return Promise.reject(new Error(t(...messages.optionsMinimum())));
			      } else if (options.length > maxOptions){
			        return Promise.reject(new Error(t(...messages.optionsMaximum())));
			      }
			    },
			  },
			]}
			initialValue={[""]}
		>
			{(fields, { add, remove }, { errors }) => (
			  <>
			    {fields.map((field, index) => (
			      <Form.Item
			        required={true}
			        key={field.key}
			      >
			        <Form.Item
			          {...field}
			          validateTrigger={['onChange', 'onBlur']}
			          noStyle
			        >
			          <Input 
			          	onChange={(e) => {onOptionChange(e, add, index, fields.length)}} 
			          	placeholder={t(...messages.options())}
			          	style={ { width: screens.xs ? '90%' : '95%' }} 
			          	/>
			        </Form.Item>
			            {fields.length > 1 ? (
			              <MinusCircleOutlined
			              	style={{padding: 4, verticalAlign: 0}}
			                className="dynamic-delete-button"
			                onClick={() => {remove(field.name)}}
			              />
			            ) : null}
			      </Form.Item>
			    ))}
			    <Form.Item>
			      <Button
			        type="dashed"
			        onClick={() => {fields.length < maxOptions && add()}}
			        style={{ width: '95%' }}
			        icon={<PlusOutlined />}
			      >
			        Add Option
			      </Button>
			      <Form.ErrorList errors={errors} />
			    </Form.Item>
			  </>
			)}
		</Form.List>
		<Form.Item initialValue={false} name="multipleOption" valuePropName="checked">
        	<Checkbox> {t(...messages.checkboxMultiple())}</Checkbox>
        </Form.Item>
		<Form.Item>
	        <Button loading={loading} style={{ width: '95%' }} type="primary" htmlType="submit">
	          {t(...messages.submit())}
	        </Button>
	      </Form.Item>
	    </Form>
	  );
	}
