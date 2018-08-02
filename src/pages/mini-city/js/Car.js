'use strict'
import utils from './utils.js';
const Car = function(color) {
    let colors = [0x2cbab2, 0x47a700, 0xd60000, 0x087f87, 0x37ad0e, 0x4d4d4d, 0xce7e00, 0xe0a213, 0x87bcde]
    let index = Math.floor(Math.random() * colors.length)

    this.color = color || colors[index]
    this.mesh = new THREE.Object3D()
    this.wheels = []
    this.startAngle = 0

    let that = this
    addBody()
    addWindows()
    addLights()
    addWheels()

    function addWheels() {
        let wheelFrontLeft = createWheel()
        wheelFrontLeft.position.set(8, 3, -6)
        that.wheels.push(wheelFrontLeft)
        that.mesh.add(wheelFrontLeft)

        let wheelFrontRight = createWheel()
        wheelFrontRight.position.set(8, 3, 6)
        that.wheels.push(wheelFrontRight)
        that.mesh.add(wheelFrontRight)

        let wheelBackLeft = createWheel()
        wheelBackLeft.position.set(-8, 3, 6)
        that.wheels.push(wheelBackLeft)
        that.mesh.add(wheelBackLeft)

        let wheelBackRight = createWheel()
        wheelBackRight.position.set(-8, 3, -6)
        that.wheels.push(wheelBackRight)
        that.mesh.add(wheelBackRight)

        function createWheel() {
            let wheel = new THREE.Object3D()

            let wheelOuterGeometry = new THREE.CylinderGeometry(3, 3, 3, 32)
            wheelOuterGeometry.rotateX(0.5 * Math.PI)
            let wheelOuter = utils.makeMesh('lambert', wheelOuterGeometry, 0x000000)
            wheel.add(wheelOuter)

            let wheelInner = utils.makeMesh('lambert', wheelOuterGeometry, 0xdddddd)
            wheelInner.castShadow = false
            wheelInner.scale.set(0.8, 0.8, 1.1)
            wheel.add(wheelInner)

            let wheelCenterGeometry = new THREE.CylinderGeometry(1, 1, 3.6, 4)
            wheelCenterGeometry.rotateX(0.5 * Math.PI)
            let wheelCenter = utils.makeMesh('lambert', wheelCenterGeometry, 0xa7a7a7)
            wheelCenter.castShadow = false
            wheel.add(wheelCenter)

            return wheel
        }
    }

    function addLights() {
        let carLightsGeometry = new THREE.Geometry()
        let carLigetGeometry = new THREE.BoxGeometry(2, 2, 2)

        let carLightsPosition = [
            [12.5, 7.1, 6.1],
            [12.5, 7.1, -6.1],
            [-14, 7.1, 6.1],
            [-14, 7.1, -6.1]
        ]
        carLightsPosition.forEach(function(elem) {
            let x = elem[0],
                y = elem[1],
                z = elem[2]
            let geometry = carLigetGeometry.clone()
            geometry.translate(x, y, z)
            carLightsGeometry.merge(geometry)
        })

        let carLightFrontGeometry = carLigetGeometry.clone()
        carLightFrontGeometry.scale(1, 1.3, 7.1)
        carLightFrontGeometry.translate(12.1, 3.3, 0)
        carLightsGeometry.merge(carLightFrontGeometry)

        let carLightBackGeometry = carLightFrontGeometry.clone()
        carLightBackGeometry.translate(-26, 0, 0)
        carLightsGeometry.merge(carLightBackGeometry)

        carLightsGeometry = new THREE.BufferGeometry().fromGeometry(carLightsGeometry)
        let carLights = utils.makeMesh('phong', carLightsGeometry, 0xffffff)
        that.mesh.add(carLights)

    }

    function addWindows() {
        let carWindows = new THREE.Object3D()

        let carWindowLeft = new THREE.Object3D()
        let carWindowLeftFrontCoords = [
            [-2, 8],
            [4, 8],
            [2.5, 12],
            [-2, 12]
        ]
        let carWindowLeftFront = makeWindow(carWindowLeftFrontCoords)
        carWindowLeft.add(carWindowLeftFront)

        let carWindowLeftBackCoords = [
            [-9, 8],
            [-3, 8],
            [-3, 12],
            [-7.5, 12]
        ]
        let carWindowLeftBack = makeWindow(carWindowLeftBackCoords)
        carWindowLeft.add(carWindowLeftBack)
        carWindowLeft.position.z = 7.1
        carWindows.add(carWindowLeft)

        let carWindowRight = carWindowLeft.clone()
        carWindowRight.position.z = -7.1
        carWindows.add(carWindowRight)

        let carWindowFrontGeometry = new THREE.CubeGeometry(0.1, 5, 12)
        carWindowFrontGeometry.rotateZ(0.12 * Math.PI)
        carWindowFrontGeometry.translate(4.2, 10, 0)
        let carWindowFront = utils.makeMesh('phong', carWindowFrontGeometry, 0x000000)
        carWindows.add(carWindowFront)

        let carWindowBack = carWindowFront.clone()
        carWindowBack.rotation.z = -0.24 * Math.PI
        carWindowBack.position.x = -19
        carWindowBack.position.y = 6
        // carWindowFrontGeometry.translate(4.2,10,7)
        carWindows.add(carWindowBack)

        that.mesh.add(carWindows)
    }

    function addBody() {
        let carBodyCoords = [
            [-13, 2],
            [13, 2],
            [13, 8],
            [5, 8],
            [3, 13],
            [-8, 13],
            [-10, 8],
            [-13, 8],
            [-13, 2]
        ]
        let carBodyShape = utils.makeShape(carBodyCoords)
        let carBodyGeometry = utils.makeExtrudeGeometry(carBodyShape, 14)
        carBodyGeometry.translate(0, -7, 0)
        carBodyGeometry.rotateX(0.5 * Math.PI)
        let carBody = utils.makeMesh('phong', carBodyGeometry, that.color)
        that.mesh.add(carBody)
    }

    function makeWindow(coords) {
        let windowColor = 0x000000
        let shape = utils.makeShape(coords)
        let geometry = utils.makeExtrudeGeometry(shape, 0.1)
        geometry.rotateX(0.5 * Math.PI)
        let mesh = utils.makeMesh('phong', geometry, windowColor)
        mesh.castShadow = false
        return mesh
    }
}
Car.prototype = {
    setPosition: function(x, y, z) {
        this.mesh.position.set(x, y, z)
    },
    forward: function(speed) {
        speed = speed || 1
        this._moving(speed, true)
    },
    backward: function(speed) {
        speed = speed || 1
        this._moving(speed, false)
    },
    turnLeft: function(angle, speed) {
        this._turn(angle, true, speed)
    },
    turnRight: function(angle, speed) {
        this._turn(angle, false, speed)
    },
    _turn: function(angle, direction, speed) {
        direction = direction ? 1 : -1
        if (speed) {
            if (this.startAngle < angle) {
                this.mesh.rotation.y += speed
                this.startAngle += speed
                if (angle - this.startAngle < speed) {
                    let originAngle = this.mesh.rotation.y - this.startAngle
                    this.mesh.rotation.y = originAngle + angle
                    this.startAngle = 0
                    return
                }
            }
        } else {
            this.mesh.rotation.y += angle * direction
        }
    },
    _moving: function(speed, direction) {
        let rotation = this.mesh.rotation.y
        direction = direction ? 1 : -1
        let xLength = speed * Math.cos(rotation) * direction,
            zLength = speed * Math.sin(rotation) * direction
        this.mesh.position.x += xLength
        this.mesh.position.z -= zLength
        this._rotateWheels(speed)
    },
    _rotateWheels: function(speed) {
        this.wheels.forEach(function(elem) {
            elem.rotation.z -= 0.1 * speed
        })
    }
}

export default Car
