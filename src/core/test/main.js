﻿define([], function () {
    return {
        services: {
            streaming: {
                data: {
                    quoteSnapshots: function() {
                        return {
                            data: function() {
                                return {
                                    done: function() {
                                        return {
                                            fail: function() {
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            },
            webapi: {
                users: {
                    accounts: function() {
                    }
                },
                data: {
                    quote: function () {
                    }
                }
            },
            authorization: {
                userId: 'Test'
            }
        },
        pubsub: function() {
        }
    };
});