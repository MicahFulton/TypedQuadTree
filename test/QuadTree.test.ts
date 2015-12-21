/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import {QuadTree} from '../src/QuadTree';
import {BoundingBox} from '../src/BoundingBox';
import {XY} from '../src/Point';
import {should, expect} from 'chai';

describe('QuadTree Test Suite', () => {
    it('should properly implement an QuadTree interface', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       var quadTree: QuadTree = new QuadTree(boundingBox);
       expect(quadTree.boundary).to.deep.equal(boundingBox);
       expect(quadTree.points.length).to.equal(0);
       expect(quadTree.insert).to.be.a('function');
       expect(quadTree.subdivide).to.be.a('function');
       expect(quadTree.queryRange).to.be.a('function');
    });

    it('should subdivide once node capacity is hit', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       var quadTree: QuadTree = new QuadTree(boundingBox);
       expect(quadTree.points.length).to.equal(0);
       quadTree.insert({x: 1, y: 1});
       quadTree.insert({x: 2, y: 1});
       quadTree.insert({x: 3, y: 1});
       quadTree.insert({x: 4, y: 1});
       expect(quadTree.points.length).to.equal(4);
       expect(quadTree.northEast).to.be.an('undefined');
       quadTree.insert({x: 4, y: 4});
       expect(quadTree.points).to.equal(null);
       expect(quadTree.northWest.isLeaf()).to.be.equal(true);
       expect(quadTree.northEast.isLeaf()).not.to.be.equal(true);
       expect(quadTree.southWest.isLeaf()).to.be.equal(true);
       expect(quadTree.southEast.isLeaf()).to.be.equal(true);
       expect(quadTree.northEast.southWest.points).to.be.deep.equal([{x: 1, y: 1}, {x: 2, y: 1}]);
       expect(quadTree.northEast.southEast.points).to.be.deep.equal([{x: 3, y: 1}, {x: 4, y: 1}]);
       expect(quadTree.northEast.northEast.points).to.be.deep.equal([{x: 4, y: 4}]);
    });
    it('should be able to handle multiple subdivisions', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       var quadTree: QuadTree = new QuadTree(boundingBox);
       expect(quadTree.points.length).to.equal(0);
       quadTree.insert({x: 1, y: 1});
       quadTree.insert({x: 2, y: 1});
       quadTree.insert({x: 3, y: 1});
       quadTree.insert({x: 4, y: 1});
       quadTree.insert({x: 4, y: 4});
       quadTree.insert({x: 4, y: 2});
       quadTree.insert({x: 5, y: 1});
       quadTree.insert({x: 5, y: 2});

       expect(quadTree.points).to.equal(null);
       expect(quadTree.northWest.isLeaf()).to.be.equal(true);
       expect(quadTree.southWest.isLeaf()).to.be.equal(true);
       expect(quadTree.southEast.isLeaf()).to.be.equal(true);

       expect(quadTree.northEast.points).to.equal(null);
       expect(quadTree.northEast.northWest.isLeaf()).to.be.equal(true);
       expect(quadTree.northEast.southWest.points).to.be.deep.equal([{x: 1, y: 1}, {x: 2, y: 1}]);
       expect(quadTree.northEast.northEast.points).to.be.deep.equal([{x: 4, y: 4}]);

       expect(quadTree.northEast.southEast.points).to.be.equal(null);
       expect(quadTree.northEast.southEast.northWest.isLeaf()).to.be.equal(true);
       expect(quadTree.northEast.southEast.northEast.points).to.be.deep.equal([{x: 4, y: 2}, {x: 5, y: 2}]);
       expect(quadTree.northEast.southEast.southWest.points).to.be.deep.equal([{x: 3, y: 1}]);
       expect(quadTree.northEast.southEast.southEast.points).to.be.deep.equal([{x: 4, y: 1}, {x: 5, y: 1}]);


    });
    it('Should find if point exists within bounding box', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       var rangeBox: BoundingBox  = new BoundingBox({x: 3, y: 3}, 1);
       var quadTree: QuadTree = new QuadTree(boundingBox);
       quadTree.insert({x: 1, y: 1});
       quadTree.insert({x: 2, y: 1});
       quadTree.insert({x: 3, y: 1});
       quadTree.insert({x: 4, y: 1});
       quadTree.insert({x: 3, y: 3});
       quadTree.insert({x: 4, y: 3});
       quadTree.insert({x: 4, y: 4});

       var expectedPointsInRange = [
           {x: 3, y: 3},
           {x: 4, y: 3},
           {x: 4, y: 4}
       ];
       expect(quadTree.queryRange(rangeBox)).to.be.deep.equal(expectedPointsInRange);
    });
    it('Should find if point exists within bounding box in multiple subdivisions', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       var rangeBox: BoundingBox  = new BoundingBox({x: 5, y: 0}, 1);
       var quadTree: QuadTree = new QuadTree(boundingBox);
       quadTree.insert({x: 1, y: 1});
       quadTree.insert({x: 2, y: 1});
       quadTree.insert({x: 3, y: 1});
       quadTree.insert({x: 4, y: 1});
       quadTree.insert({x: 4, y: 4});
       quadTree.insert({x: 4, y: 2});
       quadTree.insert({x: 5, y: 1});
       quadTree.insert({x: 5, y: 2});

       var expectedPointsInRange = [
           {x: 4, y: 1},
           {x: 5, y: 1}
       ];
       expect(quadTree.queryRange(rangeBox)).to.be.deep.equal(expectedPointsInRange);
    });
    it('Should find if point exists within bounding box in multiple subdivisions with float point bounding areas', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       var rangeBox: BoundingBox  = new BoundingBox({x: 3.5, y: 1.5}, 0.5);
       var quadTree: QuadTree = new QuadTree(boundingBox);
       quadTree.insert({x: 1, y: 1});
       quadTree.insert({x: 2, y: 1});
       quadTree.insert({x: 3, y: 1});
       quadTree.insert({x: 4, y: 1});
       quadTree.insert({x: 4, y: 4});
       quadTree.insert({x: 4, y: 2});
       quadTree.insert({x: 5, y: 1});
       quadTree.insert({x: 5, y: 2});

       var expectedPointsInRange = [
           {x: 4, y: 2},
           {x: 3, y: 1},
           {x: 4, y: 1},
       ];
       expect(quadTree.queryRange(rangeBox)).to.be.deep.equal(expectedPointsInRange);
    });
    it('Should find if no points exist within bounding box', () => {
       var boundingBox: BoundingBox  = new BoundingBox({x: 0, y: 0}, 5);
       var rangeBox: BoundingBox  = new BoundingBox({x: 55, y: 3}, 1);
       var quadTree: QuadTree = new QuadTree(boundingBox);
       quadTree.insert({x: 1, y: 1});
       quadTree.insert({x: 2, y: 1});
       quadTree.insert({x: 3, y: 1});
       quadTree.insert({x: 4, y: 1});
       quadTree.insert({x: 3, y: 3});
       quadTree.insert({x: 4, y: 3});
       quadTree.insert({x: 4, y: 4});

       var expectedPointsInRange = [];
       expect(quadTree.queryRange(rangeBox)).to.be.deep.equal(expectedPointsInRange);
    });
});