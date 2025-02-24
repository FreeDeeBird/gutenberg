/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import { isRTL, __ } from '@wordpress/i18n';
import { ToolbarButton } from '@wordpress/components';
import {
	formatOutdent,
	formatOutdentRTL,
	formatIndentRTL,
	formatIndent,
} from '@wordpress/icons';
import { useMergeRefs } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	useEnter,
	useBackspace,
	useSpace,
	useIndentListItem,
	useOutdentListItem,
	useSplit,
	useMerge,
} from './hooks';
import { convertToListItems } from './utils';

function IndentUI( { clientId } ) {
	const [ canIndent, indentListItem ] = useIndentListItem( clientId );
	const [ canOutdent, outdentListItem ] = useOutdentListItem( clientId );

	return (
		<>
			<ToolbarButton
				icon={ isRTL() ? formatOutdentRTL : formatOutdent }
				title={ __( 'Outdent' ) }
				describedBy={ __( 'Outdent list item' ) }
				disabled={ ! canOutdent }
				onClick={ outdentListItem }
			/>
			<ToolbarButton
				icon={ isRTL() ? formatIndentRTL : formatIndent }
				title={ __( 'Indent' ) }
				describedBy={ __( 'Indent list item' ) }
				isDisabled={ ! canIndent }
				onClick={ indentListItem }
			/>
		</>
	);
}

export default function ListItemEdit( {
	attributes,
	setAttributes,
	onReplace,
	clientId,
} ) {
	const { placeholder, content } = attributes;
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'core/list' ],
	} );
	const useEnterRef = useEnter( { content, clientId } );
	const useBackspaceRef = useBackspace( { clientId } );
	const useSpaceRef = useSpace( clientId );
	const onSplit = useSplit( clientId );
	const onMerge = useMerge( clientId );
	return (
		<>
			<li { ...innerBlocksProps }>
				<RichText
					ref={ useMergeRefs( [
						useEnterRef,
						useBackspaceRef,
						useSpaceRef,
					] ) }
					identifier="content"
					tagName="div"
					onChange={ ( nextContent ) =>
						setAttributes( { content: nextContent } )
					}
					value={ content }
					aria-label={ __( 'List text' ) }
					placeholder={ placeholder || __( 'List' ) }
					onSplit={ onSplit }
					onMerge={ onMerge }
					onReplace={ ( blocks, ...args ) => {
						onReplace( convertToListItems( blocks ), ...args );
					} }
				/>
				{ innerBlocksProps.children }
			</li>
			<BlockControls group="block">
				<IndentUI clientId={ clientId } />
			</BlockControls>
		</>
	);
}
