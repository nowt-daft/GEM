/**
 * @typedef {string|symbol} Key
 */
/**
 * @typedef {Descriptor|MetaDescriptor} FieldDescriptor
 */
/**
 * @typedef {Record<Key,any>} Dictionary
 */
/**
 * @typedef {Record<Key,FieldDescriptor>} FieldDescriptors
 */
/**
 * @typedef {Record<Key,Descriptor>} Descriptors
 */
export default class Fields {
    /**
     * @param    {Dictionary}  properties
     * @returns  {FieldDescriptors}
     */
    static create(properties: Dictionary): FieldDescriptors;
    /**
     * @param    {FieldDescriptors}  field_descriptors
     * @returns  {Descriptors}
     */
    static to_descriptors(field_descriptors: FieldDescriptors): Descriptors;
}
export type Key = string | symbol;
export type FieldDescriptor = Descriptor | MetaDescriptor<any>;
export type Dictionary = Record<Key, any>;
export type FieldDescriptors = Record<Key, FieldDescriptor>;
export type Descriptors = Record<Key, Descriptor>;
import Descriptor from "./descriptor.js";
import MetaDescriptor from "./meta.js";
