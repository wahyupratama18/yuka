import { Logger } from '../core/Logger.js';

/**
* Class for representing a fuzzy module. Instances of this class are used by
* game entities for fuzzy inference. A fuzzy module is a collection of fuzzy variables
* and the rules that operate on them.
*
* @author {@link https://github.com/Mugen87|Mugen87}
*/
class FuzzyModule {

	/**
	* Constructs a new fuzzy module.
	*/
	constructor() {

		/**
		* An array of the fuzzy rules.
		* @type Array
		*/
		this.rules = new Array();

		/**
		* A map of FLVs.
		* @type Map
		*/
		this.flvs = new Map();

	}

	/**
	* Adds the given FLV under the given name to this fuzzy module.
	*
	* @param {String} name - The name of the FLV.
	* @param {FuzzyVariable} flv - The FLV to add.
	* @return {FuzzyModule} A reference to this fuzzy module.
	*/
	addFLV( name, flv ) {

		this.flvs.set( name, flv );

		return this;

	}

	/**
	* Remove the FLV under the given name from this fuzzy module.
	*
	* @param {String} name - The name of the FLV to remove.
	* @return {FuzzyModule} A reference to this fuzzy module.
	*/
	removeFLV( name ) {

		this.flvs.delete( name );

		return this;

	}

	/**
	* Adds the given fuzzy rule to this fuzzy module.
	*
	* @param {FuzzyRule} rule - The fuzzy rule to add.
	* @return {FuzzyModule} A reference to this fuzzy module.
	*/
	addRule( rule ) {

		this.rules.push( rule );

		return this;

	}

	/**
	* Removes the given fuzzy rule from this fuzzy module.
	*
	* @param {FuzzyRule} rule - The fuzzy rule to remove.
	* @return {FuzzyModule} A reference to this fuzzy module.
	*/
	removeRule( rule ) {

		const rules = this.rules;

		const index = rules.indexOf( rule );
		rules.splice( index, 1 );

		return this;

	}

	/**
	* Calls the fuzzify method of the defined FLV with the given value.
	*
	* @param {String} name - The name of the FLV
	* @param {Number} value - The crips value to fuzzify.
	* @return {FuzzyModule} A reference to this fuzzy module.
	*/
	fuzzify( name, value ) {

		const flv = this.flvs.get( name );

		flv.fuzzify( value );

		return this;

	}

	/**
	* Given a fuzzy variable and a defuzzification method this returns a crisp value.
	*
	* @param {String} name - The name of the FLV
	* @param {String} type - The type of defuzzification.
	* @return {Number} The defuzzified, crips value.
	*/
	defuzzify( name, type = FuzzyModule.DEFUZ_TYPE.MAXAV ) {

		const flvs = this.flvs;
		const rules = this.rules;

		this._initConsequences();

		for ( let i = 0, l = rules.length; i < l; i ++ ) {

			const rule = rules[ i ];

			rule.evaluate();

		}

		const flv = flvs.get( name );

		let value;

		switch ( type ) {

			case FuzzyModule.DEFUZ_TYPE.MAXAV:
				value = flv.defuzzifyMaxAv();
				break;

			case FuzzyModule.DEFUZ_TYPE.CENTROID:
				value = flv.defuzzifyCentroid();
				break;

			default:
				Logger.warn( 'YUKA.FuzzyModule: Unknown defuzzification method:', type );
				value = flv.defuzzifyMaxAv(); // use MaxAv as fallback

		}

		return value;

	}

	_initConsequences() {

		const rules = this.rules;

		// initializes the consequents of all rules.

		for ( let i = 0, l = rules.length; i < l; i ++ ) {

			const rule = rules[ i ];

			rule.initConsequence();

		}

		return this;

	}

}

FuzzyModule.DEFUZ_TYPE = Object.freeze( {
	MAXAV: 0,
	CENTROID: 1
} );

export { FuzzyModule };
