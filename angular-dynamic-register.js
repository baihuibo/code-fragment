(function () {
    var registerModule = angular.module;
    angular['module'] = function (name, deps, config) {
        var providers = {};
        var module = registerModule(name, deps, function ($provide, $animateProvider, $filterProvider, $controllerProvider, $compileProvider) {
            providers['$provide'] = $provide;
            providers['$animateProvider'] = $animateProvider;
            providers['$filterProvider'] = $filterProvider;
            providers['$controllerProvider'] = $controllerProvider;
            providers['$compileProvider'] = $compileProvider;
        });

        if (config) {
            module.config(config);
        }
        module.run(fix);

        return module;

        function fix() {
            var wrappers = [
                {fnName: 'provider', serviceName: '$provide', methodName: 'provider'},
                {fnName: 'factory', serviceName: '$provide', methodName: 'factory'},
                {fnName: 'service', serviceName: '$provide', methodName: 'service'},
                {fnName: 'value', serviceName: '$provide', methodName: 'value'},
                {fnName: 'constant', serviceName: '$provide', methodName: 'constant'},
                {fnName: 'decorator', serviceName: '$provide', methodName: 'decorator'},
                {fnName: 'animation', serviceName: '$animateProvider', methodName: 'register'},
                {fnName: 'filter', serviceName: '$filterProvider', methodName: 'register'},
                {fnName: 'controller', serviceName: '$controllerProvider', methodName: 'register'},
                {fnName: 'directive', serviceName: '$compileProvider', methodName: 'directive'},
                {fnName: 'component', serviceName: '$compileProvider', methodName: 'component'}
            ];

            wrappers.forEach(function (wrap) {
                module[wrap.fnName] = function () {
                    var provider = providers[wrap.serviceName];
                    provider[wrap.methodName].apply(provider, arguments);
                }
            });
        }
    };  
}())
