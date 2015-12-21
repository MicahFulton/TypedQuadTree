/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import {BoundingBox} from '../src/BoundingBox';
import {XY} from '../src/Point';
import {should, expect} from 'chai';

describe('Bounding Box Test Suite', () => {
    it('should properly implement an Axis-Aligned Bounding Box interface', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       expect(boundingBox.center).to.deep.equal({x:0, y:0});
       expect(boundingBox.halfDimension).to.equal(5);
       expect(boundingBox.containsPoint).to.be.a('function');
       expect(boundingBox.intersectsAABB).to.be.a('function');
    });
    describe('BoundingBox contains Point Tests', () => {
        it('Should contain the point for all range values inclusive', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            for (var i: number = (Math.abs(halfDimension) * -1); i <= Math.abs(halfDimension); i++) {
                for (var j: number = (Math.abs(halfDimension) * -1); j <= Math.abs(halfDimension); j++) {
                    expect(boundingBox.containsPoint({x: i, y: j}));
                }
            }
        });
        it('Should not contain any points outside of the northeast range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            expect(boundingBox.containsPoint({x: 6, y: 6})).to.not.be.equal(true);
            expect(boundingBox.containsPoint({x: 100, y: 1000})).to.not.be.equal(true);
        });
        it('Should not contain any points outside of the northwest range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            expect(boundingBox.containsPoint({x: -6, y: 0})).to.not.be.equal(true);
            expect(boundingBox.containsPoint({x: -6, y: 1000})).to.not.be.equal(true);
        });
        it('Should not contain any points outside of the southWest range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            expect(boundingBox.containsPoint({x: -6, y: -6})).to.not.be.equal(true);
            expect(boundingBox.containsPoint({x: -6, y: -1000})).to.not.be.equal(true);
        });
        it('Should not contain any points outside of the southEast range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            expect(boundingBox.containsPoint({x: 6, y: -6})).to.not.be.equal(true);
            expect(boundingBox.containsPoint({x: 6, y: -1000})).to.not.be.equal(true);
        });
    });
    describe('Bounding Box interesects Tests', () => {
       it('Should intersect for all range values of the bounding box', ()=> {
           var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            for (var i: number = (Math.abs(halfDimension) * -1); i <= Math.abs(halfDimension); i++) {
                for (var j: number = (Math.abs(halfDimension) * -1); j <= Math.abs(halfDimension); j++) {
                    var tempBoundingBox: BoundingBox  = new BoundingBox({x: i, y: j}, halfDimension);
                    expect(boundingBox.intersectsAABB(tempBoundingBox));
                }
            }
       });
       it('Should intersect when other bounding box is outside of northeast range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            var otherBoundingBox: BoundingBox  = new BoundingBox({x: 11, y: 11}, halfDimension);
            expect(boundingBox.intersectsAABB(otherBoundingBox)).to.not.be.equal(true);
        });
        it('Should intersect when other bounding box is outside of northwest range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            var otherBoundingBox: BoundingBox  = new BoundingBox({x: -11, y: 11}, halfDimension);
            expect(boundingBox.intersectsAABB(otherBoundingBox)).to.not.be.equal(true);
        });
        it('Should intersect when other bounding box is outside of southwest range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            var otherBoundingBox: BoundingBox  = new BoundingBox({x: -11, y: -11}, halfDimension);
            expect(boundingBox.intersectsAABB(otherBoundingBox)).to.not.be.equal(true);
        });
        it('Should intersect when other bounding box is outside of southeast range', ()=> {
            var halfDimension: number = 5
            var center: XY = {x: 0, y: 0};
            var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, halfDimension);
            var otherBoundingBox: BoundingBox  = new BoundingBox({x: 11, y: -11}, halfDimension);
            expect(boundingBox.intersectsAABB(otherBoundingBox)).to.not.be.equal(true);
        });
    });
});