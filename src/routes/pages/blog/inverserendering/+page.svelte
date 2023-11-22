<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">A dip into Inverse Rendering</h1>
			<h3 class="text-xl italic">
				First week of looking into rabbit holes of interesting areas of art, tech, and ML.
			</h3>
			<div class="my-4">
				As I’m building Artscaper, I’m realizing that automating proper image labels is a crucial
				aspect of the process. One possible research avenue is to determine the light sources and
				parameters of an image, which is an idea that emerged from my years of photography
				experience. For studio and artistic portraits, lighting is often a signature element for
				many photographers. As a candid photographer, I learned to use the lighting in a scene, but
				setting up lighting to mimic artists like Brandon Woefel and Limon Fan was a challenge.
				<br /><br />Recently, I discovered the field of inverse rendering, which is an exciting area
				of computer graphics and computer vision that can analyze 2D visual data and determine
				factors such as lighting, environment geometries, and object materials.

				<br /><br />
				<h1>What is Inverse Rendering?</h1>
				Inverse rendering is the opposite of rendering: the process of generating a 2D image from a 3D
				scene, such as renders from Blender and Unity. Inverse rendering takes a 2D image and derives
				unknowns such as surface reflectance, lighting, and 3D scene geometry. It is a powerful tool
				in computer graphics and computer vision for understanding and modeling real-world scenes and
				objects from 2D images.

				<br /><br />Some of the use cases of inverse rendering include:

				<br /><br />
				<li>
					AR - To enable effective object insertion and create seamless mixed-reality illusions in
					AR, inverse rendering can be leveraged to understand the user's environment. This
					technique allows for accurate rendering of proper occlusion, reflected light, and
					perspective, taking into account the complexity of indoor and outdoor lighting and
					lighting diffusion, which can vary based on the user's position and environment. This is a
					harder problem than just using a heuristic of a directional light’s transform since indoor
					vs outdoor lighting and lighting diffusion vary depending on one’s position and
					environment.
				</li>
				<li>
					Film/Games - Inverse rendering can reduce the manual labor required for rendering objects
					in a scene and can make the objects appear more realistic with other types of lighting.
					Additionally, inverse rendering can help with the creation of special effects and can be
					used to simulate complex lighting scenarios.
				</li>
				<li>
					3D environment reconstruction and NeRFs - Inverse rendering overall can reconstruct
					environments such as interiors and landmarks for both record-keeping as interactable
					assets (Library of Alexandria problem) as well as applications in training, real estate,
					and interior design work. In addition, inverse rendering can be used to develop immersive
					VR experiences, allowing users to virtually explore reconstructed environments, like
					visiting someone's house in VR.
				</li>
				<li>
					Computer Vision - Lighting, angles, and lens artifacts are all barriers to robust object
					detection for computer vision. Analyzing the image and understanding lighting,
					reflectance, and the 3D environment through pure optics can allow algorithms to reverse
					engineer the setting for better embodied AI applications.
				</li>
				<br /><br />
				<h1>What does Inverse Rendering include?</h1>
				According to this<a
					href="https://link.springer.com/content/pdf/10.1007/978-3-030-03243-2_804-1.pdf"
					>overview</a
				>
				by Microsoft Research Asia, there are three main unknowns to derive in inverse rendering:
				<li>Surface Reflectance</li>

				<li>Scene Geometry</li>

				<li>Lighting/Illumination</li>
				<br /><br />
				<h1>Surface Reflectance</h1>
				This unknown is found usually by assuming or knowing the surface geometries and lighting of the
				scene. Those features can allow an algorithm to use the Bidirectional Reflectance Distribution
				Function (BRDF).

				<br /><br />The BRDF is a function used to estimate reflectance in relation to illumination
				and viewing geometry, which depends on the surface's structural and optical properties. This
				can include factors such as shadows, scattering, transmission, and absorption. In 3D
				applications with 2D geometry planes, the Spatially Varying Bidirectional Reflectance
				Distribution Function (SVBRDF) is often used instead. The SVBRDF is a 6-dimensional function
				that can determine the reflectance matrix of a mesh face at different 2D locations on the
				surface.
				<br /><br />
				<h1>Scene/Surface Geometry</h1>
				This topic honestly deserves its own deep dive. There are a lot of different ways that scene
				and surface geometry can be determined. Some of the methods I have worked with include LiDAR
				scanning and stereo photometry, and I know other groups who have worked with zero-shot estimation
				models as well as normal map generations.

				<br /><br />Photometry is a traditional way of reconstructing surface geometry. Using stereo
				images and multiple view methods, an algorithm can triangulate corresponding points in 3D
				space from each image. For stereo images, disparity maps are often a method to determine
				object outlines and relative depth. With proper camera calibration, the depth of an object
				can be estimated. However, this requires a lot of known information, especially the
				configuration of the camera (position and rotation of the camera, lens parameters). Camera
				parameters for computer vision will also probably be a future deep dive topic, as the
				construction of a camera lens, coupled with the body’s sensor, can result in vastly
				different images for computer vision applications.
				<br /><br />
				<h1>Current Lighting Estimation Research</h1>
				Lighting estimation is the most interesting aspect of inverse rendering for me, especially determining
				the lighting from one image alone. Previous methods have had to know priors in 3D scenes, such
				as<a href="https://cseweb.ucsd.edu/~ravir/p1004-ramamoorthi.pdf">this method</a> using
				deconvolution of the reflected light field given a known geometry and BRDF. This is a robust
				method but requires the knowledge of priors. More recently, ML methods have emerged to
				provide accurate and complex reconstructions of lighting for near-photorealistic object
				insertion from just one image. Here are some of the papers I read through:
				<br /><br />
				<h1><a href="https://github.com/YeeU/InverseRenderNet">InverseRenderNet</a></h1>
				This paper focused mainly on outdoor lighting scenes and was able to generate realistic shading
				renders from one input picture, as shown in the following picture from the paper:
				<img src="/invred1.jpg" alt="" />
				Their approach used a CNN, with pre-calculated priors for supervision and a multiview stereo
				pipeline for improved supervision while learning. They first decomposed the albedo and normal
				maps from an RGB image input with an encoder-decoder CNN architecture. The lighting could already
				be inferred from the input image given the albedo and normal maps.

				<br /><br />The model then could solve for the spherical harmonic illumination coefficients
				of the whole image. Spherical harmonics are a set of functions that form an orthonormal
				basis on the unit sphere, and they have the useful property of being able to represent any
				function that is defined on the sphere. To do this, the team took a dataset of HDR spherical
				panoramic images and calculated the spherical harmonic coefficients. From there, lighting
				coefficients can be generated with a range of [0, 2pi] as well as [-pi/6, pi/6] for pitch
				and roll. As each illumination data entry is independent, the coefficients of the spherical
				harmonic basis functions are also independent. This is nice as it creates a Gaussian
				distribution of the data and basis functions (useful for general prediction).

				<br /><br />As an application, the team was able to use illumination inferences to relight
				scenes, showing realistic shading and color balance.

				<br /><br />
				<h1><a href="https://lvsn.github.io/deepparametric/">Deep Parametric</a></h1>
				In order to have more realistic object insertion, knowledge about other lighting parameters must
				be derived. This paper focused on the localized nature of indoor lighting. As indoor lighting
				is more complex than outdoor due to a varying number of light sources with different properties,
				many hand-crafted heuristics fail. Their method produces a set of lighting parameters describing
				area lights in 3D from a single 2D low-dynamic range image including source positions, areas,
				intensities, and colors.

				<br /><br />Here is a picture of an object insertion result (the pillows and chair are
				inserted into a given 2D image):

				<img src="/invred2.jpg" alt="" />To create their training dataset, they augmented the Laval
				Indoor HDR Dataset, annotating each panorama image with EnvyDepth. Their ML architecture
				consisted of a two-stage DNN. The first stage predicts the color, position, and radius of
				the light sources. The second stage then refines the result and adds a depth estimation to
				the light source. The DNN inputs an image and outputs a 3072-dimension latent vector and is
				fed into a decoder to directly infer lighting parameters.

				<br /><br />To evaluate the effectiveness of the model, the team performed qualitative user
				studies since humans have a different understanding of realism compared to quantitative
				measures. The DeepParametric method performed better than other models at the time and could
				mimic realistic lighting well. However, a weak point was that the model did not understand
				light and color scattering that well. Additionally, the model only assumes diffuse light.
				<br /><br />
				<h1>
					<a href="https://cseweb.ucsd.edu//~viscomp/projects/CVPR20InverseIndoor/"
						>Inverse Rendering for Complex Indoor Scenes</a
					>
				</h1>
				This paper improves upon the weak points of the previous paper, as well as provides interesting
				applications of realistic material substitution. They are able to derive and reconstruct spatially-varying
				lighting, shapes, and spatially varying surface reflectance from just a single RGB image input.

				<br /><br />Using spatially varying spherical Gaussian lighting representations, inserted
				objects have realistic shading, shadowing, and reflection in the scene. Additionally, with
				SVBRDFs, the model can map photorealistic materials for material replacement. Finally, they
				used pre-computed radiance transfer methods (how objects transfer light between each other)
				and isotropic spherical Gaussians that improve upon previous spherical harmonic methods.
				This method could recover the high-frequency lighting, which is necessary to handle specular
				effects on objects.
				<br /><br />
				This model outperforms previous methods in object insertion and material editing:
				<img src="/invred3.jpg" alt="" />
				<h1>Spherical Gaussians</h1>
				The previous paper used spherical gaussian to help its lighting representation. Once estimated
				lighting is determined, spherical Gaussians are a mathematical way of rendering lighting in a
				scene as they are a compact and efficient way to represent directional lighting. Here is a very
				detailed (and math-heavy) explanation of the concept.
				<br /><br />
				<h1>Current Tools</h1>
				There are some tools currently for inverse rendering and realistic AR object insertion:

				<br /><br />
				<li>
					Google Lighting Estimation API: This API provides information on lighting cues such as
					shadows, ambient light, highlights, scene reflections, and environmental HDR.
					Additionally, it is able to determine a main directional light and simulate reflected
					light through ambient spherical harmonics and an HDR cube map This allows for ambient and
					realistic reflections on virtual objects.
				</li>
				<li>
					Mitsuba 3: This is a rendering system for forward and inverse light-transport simulation.
					Currently, it is mainly a research tool.
				</li>
				<li>
					NVidia 3D MoMa: NVidia is creating its own 3D reconstruction tool from 2D images with
					accurate light reactions.
				</li>
				<br /><br />
				<h1>The Future of Inverse Rendering</h1>
				The field of inverse rendering has made significant progress in creating more robust and photorealistic
				tools that can simulate ambient and reflected light on inserted objects, as well as model detailed
				representations of light sources in an image.

				<br /><br />However, most research has been focused on indoor and outdoor scenes with simple
				geometries, leaving a gap in models for complex and organic shapes, such as animals and
				humans. Furthermore, subsurface scattering is still an area of limited exploration.

				<br /><br />Despite these limitations, the rapid progress in scene reconstruction and
				inverse rendering research is promising, and it may be possible to identify entire lighting
				setups from a single image in the future. Inverse rendering is a critical step towards
				embodied AI for vision applications.
			</div>
		</div>
	</div>
</div>

<style type="scss">
	img {
		@apply mx-auto max-h-64 my-4;
	}
	h1 {
		@apply text-2xl;
	}
</style>
