# Memory Optimization Guide for Angular Build on Ubuntu 4GB VM

## Problem
The Angular build fails on Azure DevOps self-hosted Ubuntu 4GB VM due to insufficient memory during the `build-staging` process.

## Solutions Implemented

### 1. Package.json Optimizations
- Increased `--max_old_space_size` from 1536MB to 2048MB for regular builds
- Added new `build-staging-ci` command with 3072MB allocation for CI environments
- Added `--optimize-for-size` and `--max-semi-space-size=128` flags for better memory management

### 2. Angular Build Configuration
- Changed `vendorChunk` from `false` to `true` in staging configuration to reduce memory pressure
- Added `progress: false` and `statsJson: false` to reduce memory overhead
- Maintained other optimizations for production builds

### 3. Node.js Version Management
- Added `.nvmrc` file to ensure consistent Node.js 18.x usage
- Node.js 18.x has better memory management compared to older versions

### 4. Azure DevOps Pipeline Optimizations
See `azure-pipelines-memory-optimized.yml` for complete pipeline configuration:

#### Environment Variables:
```yaml
NODE_OPTIONS: '--max_old_space_size=3072 --optimize-for-size --max-semi-space-size=128'
NG_CLI_ANALYTICS: false
NO_UPDATE_NOTIFIER: 1
CI: true
```

#### NPM Optimizations:
- Use `npm ci` instead of `npm install`
- Disable audit, fund, and progress reporting
- Limit concurrent connections (`--maxsockets=1`)
- Clear caches before and after build

### 5. System-Level Optimizations

#### Monitor Memory Usage:
```bash
# Check available memory
free -m

# Monitor memory during build
watch -n 5 'free -m && ps aux --sort=-%mem | head -10'
```

#### VM Optimizations:
```bash
# Increase swap space (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to /etc/fstab for persistence
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### Clear System Caches:
```bash
# Clear system caches before build
sudo sync
sudo echo 1 > /proc/sys/vm/drop_caches
```

## Usage Instructions

### For Azure DevOps Pipeline:
1. Use the provided `azure-pipelines-memory-optimized.yml`
2. Replace `'your-self-hosted-pool'` with your actual agent pool name
3. Ensure your agent has Node.js 18.x installed

### For Local Testing:
1. Make the script executable: `chmod +x build-memory-optimized.sh`
2. Run: `./build-memory-optimized.sh`

### Available Build Commands:
- `npm run build-staging` - Standard staging build (2GB memory)
- `npm run build-staging-ci` - CI optimized build (3GB memory)

## Memory Allocation Strategy

| Environment | Memory Allocation | Usage |
|-------------|------------------|--------|
| Development | 2048MB | Local development |
| CI/CD | 3072MB | Azure DevOps builds |
| Production | 2048MB | Production builds |

## Monitoring and Debugging

### Check Memory Usage:
```bash
# During build
NODE_OPTIONS="--max_old_space_size=3072 --expose-gc" npm run build-staging -- --progress=false --verbose

# Monitor heap usage
node --expose-gc -e "setInterval(() => { if (global.gc) { global.gc(); } console.log(process.memoryUsage()); }, 5000)" &
```

### Common Memory Issues:
1. **Out of Memory during TypeScript compilation**: Increase `--max_old_space_size`
2. **Memory leaks in build tools**: Use `--expose-gc` and enable garbage collection
3. **Large bundle size**: Enable `vendorChunk: true` to split bundles

## Additional Recommendations

### 1. Consider Build Caching:
```yaml
# Add to Azure DevOps pipeline
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    restoreKeys: |
      npm | "$(Agent.OS)"
    path: ~/.npm
  displayName: Cache npm packages
```

### 2. Parallel Builds (if multiple projects):
Consider using a matrix strategy to build different configurations in parallel rather than sequentially.

### 3. VM Monitoring:
Set up monitoring to track memory usage patterns and identify optimal VM sizing.

## Troubleshooting

If builds still fail:

1. **Increase VM memory** to 8GB if possible
2. **Use Docker containers** with controlled memory limits
3. **Consider using Azure DevOps Microsoft-hosted agents** for builds
4. **Implement incremental builds** to reduce memory pressure

## Testing the Changes

Run the memory-optimized build locally first:
```bash
npm run build-staging-ci
```

Monitor the process:
```bash
# In another terminal
watch -n 2 'ps aux --sort=-%mem | grep node'
```