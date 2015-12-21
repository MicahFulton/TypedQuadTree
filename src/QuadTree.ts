import {BoundingBox} from './BoundingBox';
import {XY} from './Point';

export class QuadTree {
    QT_NODE_CAPACITY: number = 4;
    boundary: BoundingBox;

    points: Array<XY> = [];

    northWest: QuadTree;
    northEast: QuadTree;
    southWest: QuadTree;
    southEast: QuadTree;

    constructor(boundary: BoundingBox) {
        this.boundary = boundary;
    }

    isLeaf(): boolean {
        return !!!this.northWest;
    }

    insert(p: XY): boolean {
        if (!this.boundary.containsPoint(p)) {
            return false;
        }
        if (this.points && this.points.length < this.QT_NODE_CAPACITY) {
            this.points.push(p);
            return true;
        }
        if(this.isLeaf()) {
            this.subdivide();
        }
        return this.northWest.insert(p) || this.northEast.insert(p) || this.southWest.insert(p) || this.southEast.insert(p);
    }

    subdivide(): void {
        var box: BoundingBox;
        var newBoundary: number = this.boundary.halfDimension / 2;
        box = new BoundingBox({
            x: this.boundary.center.x - newBoundary,
            y: this.boundary.center.y + newBoundary,
        }, newBoundary);
        this.northWest = new QuadTree(box);

        box = new BoundingBox({
            x: this.boundary.center.x + newBoundary,
            y: this.boundary.center.y + newBoundary
        }, newBoundary);
        this.northEast = new QuadTree(box);

        box = new BoundingBox({
            x: this.boundary.center.x - newBoundary,
            y: this.boundary.center.y - newBoundary
        }, newBoundary);
        this.southWest = new QuadTree(box);

         box = new BoundingBox({
            x: this.boundary.center.x + newBoundary,
            y: this.boundary.center.y - newBoundary
        }, newBoundary);
        this.southEast = new QuadTree(box);

        this.points.forEach((point: XY) => {
           this.northWest.insert(point) ||
           this.northEast.insert(point) ||
           this.southEast.insert(point) ||
           this.southWest.insert(point);
        });
        this.points = null;
    }

    queryRange(range: BoundingBox): Array<XY> {
        var pointsInRange: Array<XY> = [];
        if(!this.boundary.intersectsAABB(range)) {
            return pointsInRange;
        }
        pointsInRange = this.points ? this.points.filter((point: XY) => range.containsPoint(point)) : [];
        if(this.isLeaf()) {
            return pointsInRange;
        }
        pointsInRange.push(...this.northWest.queryRange(range));
        pointsInRange.push(...this.northEast.queryRange(range));
        pointsInRange.push(...this.southWest.queryRange(range));
        pointsInRange.push(...this.southEast.queryRange(range));
        return pointsInRange;
    }
}