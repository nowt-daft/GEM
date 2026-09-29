/**
 * @typedef {string|symbol} Key
 */
/**
 * @typedef {Record<Key,any>} Dictionary
 */
/**
 * @typedef {FixedProperty|VariableProperty} Property
 */
/**
 * @typedef {Record<Key,Property>} PropertyDescriptors
 */
export default class Properties {
    /**
     * @param   {Dictionary}       properties  A dictionary of Key-Value pairs
     * @param   {boolean}          enumerable
     * @param   {new => Property}  descriptor
     * @returns {PropertyDescriptors}  A dictionary of property descriptors
     */
    static create(properties: Dictionary, enumerable: boolean, descriptor: new () => Property): PropertyDescriptors;
    /**
     * @param    {Dictionary}  properties  A dictionary of Key-Value pairs
     * @param    {boolean}     enumerable
     * @returns  {PropertyDescriptors}  An object of Property Descriptors
     */
    static fixed(properties: Dictionary, enumerable: boolean): PropertyDescriptors;
    /**
     * @param    {Dictionary}  properties  A dictionary of Key-Value pairs
     * @param    {boolean}     enumerable
     * @returns  {PropertyDescriptors}  An object of Property Descriptors
     */
    static variable(properties: Dictionary, enumerable: boolean): PropertyDescriptors;
}
export type Key = string | symbol;
export type Dictionary = Record<Key, any>;
export type Property = FixedProperty<any> | VariableProperty<any>;
export type PropertyDescriptors = Record<Key, Property>;
import { FixedProperty } from './property.js';
import { VariableProperty } from './property.js';
