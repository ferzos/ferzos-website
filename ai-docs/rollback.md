# Rollback

This site has no feature flags. A bad production deploy is rolled back by redeploying the previous Vercel Production deployment.

1. Open the Vercel project [ferzos-website](https://vercel.com/ferdinand-chandras-projects/ferzos-website).
2. Open Deployments and find the last Production deployment that was healthy.
3. Redeploy that deployment to Production.
4. Confirm the running commit:

```sh
pnpm run control -- health --origin <production-url> --sha <previous-sha>
```

The production URL is the environment URL on that Vercel deployment. Do not invent a flag to hide a broken release; roll the deployment back.
