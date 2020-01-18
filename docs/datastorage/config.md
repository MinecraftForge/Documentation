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

  // There are other value types
  public final ForgeConfigSpec.BooleanValue setting;
    
  public MyConfig(ForgeConfigSpec.Builder builder) {
    setting = builder
      .comment("This is comment")
      .define("setting", false);
    }
    
  public static boolean getSetting() {
      return INSTANCE.setting.get();
  }
  
  static {
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
    
    // You can also register client only config or server only config
    ModLoadingContext.get().registerConfig(ModConfig.Type.COMMON, MyConfig.SPEC);
  }
  //...
}
```
Don't read config value too early.
Client side config will not be ready until main menu shows up.
Server side config will not be ready until world loads.
