The Config System
=====================

Sometimes you want to provide some configurable options to your mod.
You want to save configuration to file and have an ingame gui to change it.
Then you should use the config system.
This is an example of how to use it.

```Java
public class MyConfig {
  public static final MyConfig INSTANCE;
  public static final ForgeConfigSpec SPEC;

  // This is a config term
  // There are other value types such as IntValue, EnumValue
  public final ForgeConfigSpec.BooleanValue setting;
    
  public MyConfig(ForgeConfigSpec.Builder builder) {
    setting = builder
      .comment("This is comment")
      .define("setting", false);
    //use defineEnum() to define enum type setting
    //use defineInRange() to limit number range
    //use translation() to specify translation key
    //use worldRestart() to specify that world should reload when config changes
    //You can also register nested config. Check the code of ForgeConfigSpec.Builder for more information
  }
  
  // Read the config value
  // Don't read it too early
  public static boolean getSetting() {
      return INSTANCE.setting.get();
  }
  
  static {
    //convention
    Pair<MyConfig, ForgeConfigSpec> pair = new ForgeConfigSpec.Builder().configure(MyConfig::new);
      INSTANCE = pair.getKey();
      SPEC = pair.getValue();
  }
}

@Mod("examplemod")
public class ExampleMod {
  //...
  public ExampleMod() {
    //...
    
    // Register the config here
    // You can also register client only config or server only config by specifying ModConfig.Type.CLIENT or ModConfig.Type.SERVER
    ModLoadingContext.get().registerConfig(ModConfig.Type.COMMON, MyConfig.SPEC);
  }
  //...
}
```
