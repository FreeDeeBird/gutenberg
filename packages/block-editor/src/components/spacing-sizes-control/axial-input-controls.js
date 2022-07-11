/**
 * WordPress dependencies
 */
import { Flex } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SpacingRangeControl from './spacing-range-control';
import { LABELS, getSpacingPresetSlug, getSliderValueFromSlug } from './utils';

const groupedSides = [ 'vertical', 'horizontal' ];

export default function AxialInputControls( {
	onChange,
	onFocus,
	values,
	sides,
	...props
} ) {
	const createHandleOnFocus = ( side ) => () => {
		if ( ! onFocus ) {
			return;
		}
		onFocus( side );
	};

	const createHandleOnChange = ( side ) => ( next ) => {
		if ( ! onChange ) {
			return;
		}
		const nextValues = { ...values };
		const nextValue = next;

		if ( side === 'vertical' ) {
			nextValues.top = nextValue;
			nextValues.bottom = nextValue;
		}

		if ( side === 'horizontal' ) {
			nextValues.left = nextValue;
			nextValues.right = nextValue;
		}

		onChange( nextValues );
	};

	// Filter sides if custom configuration provided, maintaining default order.
	const filteredSides = sides?.length
		? groupedSides.filter( ( side ) => sides.includes( side ) )
		: groupedSides;

	return (
		<Flex className="component-spacing-sizes-control__input-controls-wrapper">
			<Flex
				gap={ 0 }
				align="top"
				className="component-spacing-sizes-control__input-controls"
			>
				{ filteredSides.map( ( side ) => {
					const axisValue =
						side === 'vertical' ? values.top : values.left;
					const slug = getSpacingPresetSlug( axisValue );
					const value = getSliderValueFromSlug(
						slug,
						props.spacingSizes
					);
					return (
						<SpacingRangeControl
							{ ...props }
							value={ value }
							onChange={ createHandleOnChange( side ) }
							onFocus={ createHandleOnFocus( side ) }
							label={ LABELS[ side ] }
							key={ `box-control-${ side }` }
							withInputField={ false }
						/>
					);
				} ) }
			</Flex>
		</Flex>
	);
}
