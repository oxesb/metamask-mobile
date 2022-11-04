# AvatarBaseBase

The AvatarBaseBase component is a base component of Metamask's [AvatarBase](../../AvatarBase.tsx). It contains all the shared configurations and styling amongst all AvatarBase variants and should not be used unless creating a new type of AvatarBase.

## Props

This component extends Morph's [AvatarBaseProp](../../../../../../../../component-library/components/Avatars/Avatar/foundation/AvatarBase/AvatarBase.tsx) component.

### `size`

Optional enum to select between size variants.

| <span style="color:gray;font-size:14px">TYPE</span> | <span style="color:gray;font-size:14px">REQUIRED</span> | <span style="color:gray;font-size:14px">DEFAULT</span> |
| :-------------------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------- |
| [AvatarSizes](../../Avatar.types.ts)          | No                                                     | Md                                                     |

### `backgroundColor`

Optional enum to add color to the background of the Avatar.

| <span style="color:gray;font-size:14px">TYPE</span> | <span style="color:gray;font-size:14px">REQUIRED</span> |
| :-------------------------------------------------- | :------------------------------------------------------ |
| ColorValue                                              | No                                                     |

### `isBadgeIncluded`

Optional boolean to select if badge should be included.

| <span style="color:gray;font-size:14px">TYPE</span> | <span style="color:gray;font-size:14px">REQUIRED</span> | <span style="color:gray;font-size:14px">DEFAULT</span> |
| :-------------------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------- |
| boolean                   | No                                                     | false                                                     |

### `badgeProps`

Optional enum for the Badge props.

| <span style="color:gray;font-size:14px">TYPE</span> | <span style="color:gray;font-size:14px">REQUIRED</span> |
| :-------------------------------------------------- | :------------------------------------------------------ |
| [BadgeProps](../../../../../../Badges/Badge/Badge.types.ts)                                      | No                                                     |

### `badgePosition`

Optional enum to set the position for the Badge.

| <span style="color:gray;font-size:14px">TYPE</span> | <span style="color:gray;font-size:14px">REQUIRED</span> | <span style="color:gray;font-size:14px">DEFAULT</span> |
| :-------------------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------- |
| [AvatarBadgePositions](../../Avatar.types.ts)          | No                                                     | [AvatarBadgePositions.TopRight](../../Avatar.types.ts)                                        |

## Usage

```javascript
<AvatarBaseBase 
  size={AvatarSizes.Md}
  backgroundColor={'#000000'}>
    <SAMPLE_COMPONENT />
</AvatarBaseBase>;
```