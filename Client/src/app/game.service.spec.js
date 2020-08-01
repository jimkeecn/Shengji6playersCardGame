"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var game_service_1 = require("./game.service");
describe('GameService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(game_service_1.GameService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});
