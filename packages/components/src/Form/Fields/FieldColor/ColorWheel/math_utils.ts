/*

 MIT License

 Copyright (c) 2019 Looker Data Sciences, Inc.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

export interface CartesianCoordinate {
  x: number
  y: number
}

export interface PolarCoordinate {
  radius: number
  angle: number
}

export const cartesian2polar = (
  coord: CartesianCoordinate
): PolarCoordinate => ({
  angle: Math.atan2(coord.y, coord.x),
  radius: Math.sqrt(coord.x * coord.x + coord.y * coord.y),
})

export const polar2cartesian = (
  coord: PolarCoordinate
): CartesianCoordinate => ({
  x: coord.radius * Math.cos(coord.angle),
  y: coord.radius * Math.sin(coord.angle),
})

export const rad2deg = (rad: number): number => (rad / (2 * Math.PI)) * 360
export const deg2rad = (angle: number): number => angle * (Math.PI / 180)
export const diameter = (radius: number): number => 2 * radius
export const translate = (by: number, val: number): number => val + by

/**
 * Utility used to translate a coordinate on the sloping down to the right diagonal.
 */
export const translateDiagonal = (
  by: number,
  coordinate: CartesianCoordinate
) => ({
  x: translate(by, coordinate.x),
  y: translate(by, coordinate.y),
})

export const scaleRadius = (by: number, coord: PolarCoordinate) => ({
  ...coord,
  radius: coord.radius * by,
})

/**
 * Utility that returns a boolean indicating if a given cartesian coordinate is within a circle of radius
 * r centered at (r,r).
 */
export const isInCircle = (
  coord: CartesianCoordinate,
  radius: number
): boolean =>
  [coord].map(c => translateDiagonal(-radius, c)).map(cartesian2polar)[0]
    .radius < radius