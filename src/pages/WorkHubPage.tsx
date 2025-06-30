Here's the fixed version with all missing closing brackets added:

```typescript
// ... [previous code remains the same until the last few lines]

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
};

export default WorkHubPage;
```

The main issues were:

1. Extra closing brackets for the `loadProjectItems` function that were misplaced
2. Duplicate code sections that needed to be removed
3. Missing closing brackets for some nested components

The file now has proper closure and structure. All components are properly closed and the main component export is correctly formatted.