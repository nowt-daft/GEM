import {
	concat,
	forEach,
	filter,
	build,
	verify
} from './types/object.js';

import is from './utils/is.js';
import {
	capitalise,
} from './utils/string.js';

import Properties from './descriptors/properties.js';
import Accessor from './descriptors/accessor.js';
import Fields from './descriptors/fields.js';
import Field from './descriptors/field.js';

import Attr, { Attribute } from './descriptors/gui/attribute.js';
import Var, { Variable } from './descriptors/gui/var.js';
export { Attr, Var };

import {
	MetaType,
} from './gem.js';

import GenericEvent from './types/events/generic.js';
import ResizeEvent from './types/events/resize.js';

import Any from './types/any.js';
import List from "./types/list.js";

import ComponentDefinitionError from
	'./errors/component_definition.js';

const HTML = 'HTML';

const CONNECTED = 'connected';
const DISCONNECTED = 'disconnected';
const RENDER = 'render';
const RESIZE = 'resize';

const ID_DELIM = '#';
const CLASS_DELIM = '.';
const TAG_DELIM = '-';

const RESIZE_LISTENER =
	new ResizeObserver(
		events => events.forEach(
			({ target, contentRect }) =>
				target.bounds = contentRect
		)
	);

/**
 * @callback HTMLListener
 * @param    {Event}
 */

/**
 * Create/spawn a new HTML element with the given attributes and dataset.
 * First argument is of the format: "html-tag#id.class.class..." where the
 * id and classes are optional. However, the id must come before the classes.
 *
 * @example
 * create("div#some-id.warning.pop-up");
 *
 * @example
 * create(
 *   "video",
 *   {
 *     id: "main-video",
 *     className: "hero-player blue-theme",
 *     autoPlay: true,
 *     autoLoad: true
 *   }
 * );
 *
 * @param                 {string}  tag         Tag name of the element.
 * @param     {Record<string,any>}  attributes  Attributes/properties.
 * @param  {Record<string,string>}  dataset     Dataset.
 *
 * @returns          {HTMLElement}
 */
export const create = (
	tag,
	attributes = {},
	dataset = {}
) => {
	const [identifier, ...classes] = tag.split(CLASS_DELIM);
	const [name, id] = identifier.split(ID_DELIM);

	const element = document.createElement(name);

	if (id)
		element.id = id;

	if (classes.length)
		element.classList.add(...classes);
	
	Object.assign(
		Object.assign(element, attributes).dataset,
		dataset
	);

	return element;
};

const HTMLProperties = Fields.to_descriptors({
	styles: Accessor.Cache(
		({ target }) => getComputedStyle(target)
	),
	bounds: Field(DOMRect)
			.listen(
				({ target, to: bounds }) =>
					target.dispatch(new ResizeEvent(bounds))
			)
});

/**
 * @param   {new HTMLElement}  T
 * @returns Record<string,object>
 */
const HTMLPrototype = (T = HTMLElement) => {
	return {
		attr: {
			params: {
				"key*": String,
				"value?": String
			},
			method(
				key,
				value
			) {
				return value === "" ?
					this.getAttribute(key) :
					this.setAttribute(key, value) ?? value;
			},
			returns: String
		},

		var: {
			params: {
				"name": String,
				"value?": String
			},
			method(
				name,
				value
			) {
				const key = `--${ name }`;
				return value === "" ?
					this.styles.getPropertyValue(key) :
					this.style.setProperty(key, value) ?? value;
			},
			returns: String
		},

		attach: {
			params: {
				"...elements": List(HTMLElement)
			},
			method(
				...elements
			) {
				this.append(...elements);
				return this;
			},
			returns: T
		},

		detach: {
			params: {
				"...elements": List(HTMLElement)
			},
			method(
				...elements
			) {
				for (const element of elements)
					this.removeChild(element);
				return this;
			},
			returns: T
		},

		listen: {
			params: {
				channel: String,
				listener: Function, // TODO: WE NEED A Callback TYPE.
				"captures?": false
			},
			method(
				channel,
				listener,
				captures = false
			) {
				if (channel === RESIZE)
					RESIZE_LISTENER.observe(this);
				
				this.addEventListener(
					channel,
					listener,
					captures
				);

				return this;
			},
			returns: T
		},

		unlisten: {
			params: {
				channel: String,
				listener: Function, // TODO: Use Callback type
				"captures?": false
			},
			method(
				channel,
				listener,
				captures = false
			) {
				if (channel === RESIZE)
					RESIZE_LISTENER.unobserve(this);

				this.removeEventListener(
					channel,
					listener,
					captures
				);

				return this;
			},
			returns: T
		},

		dispatch: {
			params: {
				event: Any, // TODO: This should be Either(String, Object)
				"data?": Object
			},
			method(
				event,
				data = {}
			) {
				this.dispatchEvent(
					is.string(event) ?
						new GenericEvent(event, data) :
						event
				);
				return this;
			},
			returns: T
		}
	}
}

/**
 * @deprecated
 * DEPRECATED. HTMLElement will absorb necessary FIELDS
 * and PROTOTYPE, then Component will do the rest.
 */
// export const HTMLAbstract = Abstract(
// 	"HTMLAbstract",
// 	{
// 		...HTMLProperties,
// 		...HTMLPrototype
// 	}
// );

/**
 * @class HTMLComponent
 * @extends HTMLElement
 *
 * @deprecated
 *
 * THIS IS DEPRECATED. Only leaving reference as the static
 * methods MIGHT be used in the future elsewhere.
 */
// export class HTMLComponent extends Class(
// 	"HTMLSuperComponent",
// 	[
// 		HTMLElement,
// 		HTMLAbstract
// 	],
// ) {
// 	constructor() {
// 		super();
// 	}
//
// 	/**
// 	 * @param   {Record<string><any>}    attributes
// 	 * @param   {Record<string><string>} dataset
// 	 * @returns {HTMLComponent}          new HTMLComponent
// 	 */
// 	static create(
// 		attributes = {},
// 		dataset = {}
// 	) {
// 		return create(
// 			this.TAG,
// 			attributes,
// 			dataset
// 		);
// 	}
//
// 	static {
// 		let name = this.name.slice(HTML.length);
// 		if (name.endsWith(ELEMENT))
// 			name = name.slice(0, -ELEMENT.length);
//
// 		let tag = '';
// 		for (const letter of name)
// 			tag += is_capital(letter) ?
// 				TAG_DELIM + letter.toLowerCase() :
// 				letter;
//
// 		if (tag.startsWith(TAG_DELIM))
// 			tag = tag.slice(1);
//
// 		this.TAG = tag;
// 	}
// }

/**
 * Add our custom fields and prototype to ALL
 * existing Elements, bb.
 */
Object.defineProperties(
	HTMLElement.prototype,
	concat(
		HTMLProperties,
		Properties.fixed(
			HTMLPrototype(HTMLElement),
			false
		)
	)
);

/**
 * @callback DefineComponent
 *
 * @param {string}              tag        HTML tag
 * @param {(new *)[]}           parents    Parent classes
 * @param {Record<string,any>}  definition
 *
 * @returns {HTMLElement}
 */
/** @type {DefineComponent} */
export const Component = MetaType(
	'Component',
	(
		tag,
		{
			parents: [parent],
			prescriptor,
			properties,
			prototype,
			listeners
		}
	) => {
		const names = (tag = tag.toLowerCase()).split(TAG_DELIM);
		
		if (names.length === 1)
			throw new ComponentDefinitionError(tag);


		const class_name = names.map(
			str => capitalise(str)
		).join('');

		const attributes = filter(
			prescriptor,
			(_, field) => field instanceof Attribute
		);
		const variables = filter(
			prescriptor,
			(_, field) => field instanceof Variable
		);
		const each_listener = callback =>
			forEach(
				listeners,
				(key, listener_list) =>
					listener_list.forEach(
						listener => callback(key, listener)
					)
			);

		Object.assign(
			properties,
			HTMLProperties
		);

		const T = {
			[class_name]: class extends (
				// TODO:
				// It might, in fact, ALWAYS be HTMLElement, and
				// hence WHY we need the extends property in the
				// customElements.define call...
				parent?.name.startsWith(HTML) ?
					parent :
					HTMLElement
			) {
				#connected = false;

				static {
					customElements.define(
						tag, // HTML TAG (eg. navigation-pane)
						this, // Class (eg. NavigationPane)
						this.__proto__ === HTMLElement ?
							undefined :
							{ extends: this.__proto__ }
					);
				}

				constructor() {
					super();
					build(this);
				}

				connectedCallback() {
					this.#connected = true;
					this.bounds = this.getBoundingClientRect();

					verify(this);

					each_listener(
						(key, listener) =>
							this.listen(key, listener)
					);

					this.dispatch(CONNECTED);
					this.renderCallback();

					return void 0;
				}

				disconnectedCallback() {
					this.#connected = false;

					each_listener(
						(key, listener) =>
							this.unlisten(key, listener)
					);

					this.dispatch(DISCONNECTED);

					return void 0;
				}

				renderCallback() {
					if (!this.#connected)
						return;

					forEach(
						attributes,
						key => this[key] = this.attr(key)
					);
					forEach(
						variables,
						key => this[key] = this.var(key)
					);

					this.dispatch(RENDER);

					requestAnimationFrame(
						() => this.renderCallback()
					);

					return void 0;
				}
			}
		}[class_name];

		Object.assign(
			prototype,
			HTMLPrototype(T)
		);

		return T;
	}
);
