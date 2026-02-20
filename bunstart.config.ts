const bunstartConfig = {
    repo: {
        apps: {
            'docs': { name: '@form-instant/docs', dependsOn: [] }
        },
        packages: {
            'react-resolver-zod': { name: '@form-instant/react-resolver-zod', dependsOn: ["react-input-mapping"] }
        }
    }
};

export default bunstartConfig;
