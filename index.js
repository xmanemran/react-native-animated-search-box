import React, {Component} from 'react';
import {View, Platform, Text, TouchableWithoutFeedback, Animated, TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Icon from "react-native-vector-icons/MaterialIcons";

export default class SearchBar extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			elementWidth: 0
		};
		this.iconElementSize = props.iconElementSize;
		this.searchIconMove = new Animated.Value(0);
		this.opacity = new Animated.Value(0);
	}
	
	render(){
		const {containerStyle, elementHeight} = this.props;
		return (
			<View style={[styles.flexRowAndCenter, containerStyle]} onLayout={this._rootLayoutEvent}>
				{this.closeIcon()}
				{this.searchIcon()}
				{this.title()}
				{this.searchBox()}
				{this.underline()}
			</View>
		)
	}
	
	animation(setValue, toValue){
		this.searchIconMove.setValue(setValue);
		this.opacity.setValue(setValue);
		Animated.parallel([
			Animated.timing(this.opacity, {
				toValue,
				duration: 200
			}),
			Animated.timing(this.searchIconMove, {
				toValue,
				duration: 300
			}),
		]).start();
	}
	
	moveSearchAction(){
		this.animation(0, 1);
	}
	
	
	resetAction(){
		this.animation(1, 0);
	}
	
	
	searchIcon(){
		const {searchIconColor, searchIconSize, searchActiveIconOpacity} = this.props;
		const {elementWidth} = this.state;
		const iconElementSize = this.iconElementSize;
		
		let searchIconPosition = this.searchIconMove.interpolate({
			inputRange: [0, 1],
			outputRange: [0, elementWidth - this.iconElementSize]
		});
		
		let opacity = this.searchIconMove.interpolate({
			inputRange: [0, 1],
			outputRange: [1, searchActiveIconOpacity]
		});
		
		
		return (
			<Animated.View style={[styles.centerAndAbsolute, {height: iconElementSize, width: iconElementSize, right: searchIconPosition, opacity}]}>
				<TouchableWithoutFeedback onPress={() => {
					this.moveSearchAction()
				}}>
					<Icon name={"search"} color={searchIconColor} size={searchIconSize}/>
				</TouchableWithoutFeedback>
			</Animated.View>
		)
	}
	
	
	closeIcon(){
		const {closeIconSize, closeIconColor, closeButtonOpacity} = this.props;
		const {elementWidth} = this.state;
		const iconElementSize = this.iconElementSize;
		
		let opacity = this.opacity.interpolate({
			inputRange: [0, 1],
			outputRange: [0, closeButtonOpacity]
		});
		
		return (
			<Animated.View style={[styles.centerAndAbsolute, {height: iconElementSize, width: iconElementSize, right: 0, opacity}]}>
				<TouchableWithoutFeedback onPress={() => {
					this.resetAction()
				}}>
					<Icon name={"close"} color={closeIconColor} size={closeIconSize}/>
				</TouchableWithoutFeedback>
			</Animated.View>
		)
	}
	
	title(component){
		
		let opacity = this.opacity.interpolate({
			inputRange: [0, 1],
			outputRange: [1, 0]
		});
		
		return this._wrapperForTitleAndSearchBox(this._headerTitle(), {opacity: opacity})
	}
	
	searchBox(component){
		return this._wrapperForTitleAndSearchBox(this._searchInput(), {opacity: this.opacity})
	}
	
	underline(){
		const {underLineStyle} = this.props;
		const {elementWidth} = this.state;
		const marginTop = this.iconElementSize / 1.5;
		let opacity = this.opacity.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1]
		});
		
		
		return (
			<Animated.View style={[styles.underLine, {opacity, width: elementWidth - 20, marginTop}, underLineStyle]}></Animated.View>
		)
	}
	
	
	_headerTitle(){
		const {titleTextStyle, titleText} = this.props;
		return (
			<Text style={titleTextStyle}>{titleText}</Text>
		)
	}
	
	_searchInput(){
		const {textInputProps, textInputStyle} = this.props;
		
		const {elementWidth} = this.state;
		const iconElementSize = this.iconElementSize;
		const width = elementWidth - (iconElementSize + iconElementSize);
		return (
			<TextInput {...textInputProps}
				style={[{width, height: iconElementSize}, textInputStyle]}/>
		)
	}
	
	_wrapperForTitleAndSearchBox(element, opacityStyle){
		const {elementWidth} = this.state;
		const iconElementSize = this.iconElementSize;
		const width = elementWidth - (iconElementSize + iconElementSize);
		return (
			<Animated.View style={[styles.centerAndAbsolute, {width, height: iconElementSize, right: iconElementSize}, opacityStyle]}>
				{element}
			</Animated.View>
		)
	}
	
	_rootLayoutEvent = (event) => {
		const {x, y, width, height} = event.nativeEvent.layout;
		this.setState({elementWidth: width});
	}
}

SearchBar.defaultProps = {
	searchIconColor: '#FFF',
	searchIconSize: 30,
	closeIconColor: '#FFF',
	closeIconSize: 30,
	containerStyle: {
		backgroundColor: 'green',
	},
	titleTextStyle: {
		color: 'white',
		fontSize: 17,
		fontWeight: '600'
	},
	titleText: "Home",
	textInputProps: {
		placeholderTextColor: '#DDD',
		placeholder: 'Search',
		underlineColorAndroid: 'transparent'
	},
	textInputStyle: {
		color: 'white',
		fontSize: 17,
	},
	iconElementSize: 48,
	searchActiveIconOpacity: 0.7,
	closeButtonOpacity: 0.7,
	underLineStyle : {}
}

SearchBar.propTypes = {
	searchIconColor: PropTypes.string,
	searchIconSize: PropTypes.number,
	closeIconColor: PropTypes.string,
	closeIconSize: PropTypes.number,
	containerStyle: PropTypes.object,
	titleTextStyle: PropTypes.object,
	titleText: PropTypes.string,
	textInputProps: PropTypes.object,
	textInputStyle: PropTypes.object,
	iconElementSize: PropTypes.number,
	searchActiveIconOpacity: PropTypes.number,
	closeButtonOpacity:PropTypes.number,
	underLineStyle : PropTypes.object
}

var styles = StyleSheet.create({
	flexRowAndCenter: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		flex: 1
	},
	underLine: {
		height: 1,
		backgroundColor: '#DDD',
	},
	centerAndAbsolute: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	}
});